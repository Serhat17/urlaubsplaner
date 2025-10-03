package com.adesso.urlaubsplanner.service;

import com.adesso.urlaubsplanner.dto.VacationRequestDTO;
import com.adesso.urlaubsplanner.model.User;
import com.adesso.urlaubsplanner.model.VacationRequest;
import com.adesso.urlaubsplanner.model.VacationStatus;
import com.adesso.urlaubsplanner.repository.UserRepository;
import com.adesso.urlaubsplanner.repository.VacationRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Service for managing vacation requests
 */
@Service
@RequiredArgsConstructor
public class VacationService {

    private final VacationRequestRepository vacationRequestRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    /**
     * Create a new vacation request
     */
    @Transactional
    public VacationRequest createVacationRequest(VacationRequestDTO dto) {
        // Validate dates
        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }

        // Calculate days requested
        long daysRequested = ChronoUnit.DAYS.between(dto.getStartDate(), dto.getEndDate()) + 1;

        // Check if user has enough vacation days
        User user = userRepository.findByUsername(dto.getEmployeeName())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + dto.getEmployeeName()));

        if (user.getRemainingVacationDays() < daysRequested) {
            throw new IllegalArgumentException("Insufficient vacation days. Available: " + 
                    user.getRemainingVacationDays() + ", Requested: " + daysRequested);
        }

        VacationRequest request = new VacationRequest();
        request.setEmployeeName(dto.getEmployeeName());
        request.setStartDate(dto.getStartDate());
        request.setEndDate(dto.getEndDate());
        request.setAbsenceType(dto.getAbsenceType());
        request.setNotes(dto.getNotes());
        request.setRepresentativeName(dto.getRepresentativeName());
        request.setStatus(VacationStatus.PENDING);

        VacationRequest saved = vacationRequestRepository.save(request);
        
        // Audit log
        auditLogService.logRequestAction(
            "CREATE_REQUEST", 
            dto.getEmployeeName(), 
            dto.getEmployeeName(), 
            saved.getId(),
            String.format("Created %s request from %s to %s (%d days)", 
                saved.getAbsenceType().getDisplayName(), 
                dto.getStartDate(), 
                dto.getEndDate(), 
                daysRequested)
        );

        return saved;
    }

    /**
     * Get all vacation requests (for managers)
     */
    public List<VacationRequest> getAllVacationRequests() {
        return vacationRequestRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Get vacation requests for a specific employee
     */
    public List<VacationRequest> getVacationRequestsByEmployee(String employeeName) {
        return vacationRequestRepository.findByEmployeeName(employeeName);
    }

    /**
     * Approve a vacation request with optional reason
     */
    @Transactional
    public VacationRequest approveVacationRequest(Long id, String approvedBy, String reason) {
        VacationRequest request = vacationRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vacation request not found: " + id));

        if (request.getStatus() != VacationStatus.PENDING) {
            throw new IllegalStateException("Only pending requests can be approved");
        }

        request.setStatus(VacationStatus.APPROVED);
        request.setApprovedBy(approvedBy);
        request.setApprovalReason(reason);
        
        // Update user's used vacation days
        User user = userRepository.findByUsername(request.getEmployeeName())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + request.getEmployeeName()));
        
        user.setUsedVacationDays(user.getUsedVacationDays() + request.getDaysRequested().intValue());
        userRepository.save(user);

        VacationRequest saved = vacationRequestRepository.save(request);
        
        // Audit log
        String details = String.format("Approved %s request #%d for %s (%d days)",
                request.getAbsenceType().getDisplayName(),
                id,
                request.getEmployeeName(),
                request.getDaysRequested());
        if (reason != null && !reason.isEmpty()) {
            details += " - Reason: " + reason;
        }
        
        auditLogService.logRequestAction(
            "APPROVE_REQUEST",
            approvedBy,
            request.getEmployeeName(),
            id,
            details
        );

        return saved;
    }

    /**
     * Reject a vacation request with optional reason
     */
    @Transactional
    public VacationRequest rejectVacationRequest(Long id, String rejectedBy, String reason) {
        VacationRequest request = vacationRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vacation request not found: " + id));

        if (request.getStatus() != VacationStatus.PENDING) {
            throw new IllegalStateException("Only pending requests can be rejected");
        }

        request.setStatus(VacationStatus.REJECTED);
        request.setApprovedBy(rejectedBy);
        request.setApprovalReason(reason);
        VacationRequest saved = vacationRequestRepository.save(request);
        
        // Audit log
        String details = String.format("Rejected %s request #%d for %s",
                request.getAbsenceType().getDisplayName(),
                id,
                request.getEmployeeName());
        if (reason != null && !reason.isEmpty()) {
            details += " - Reason: " + reason;
        }
        
        auditLogService.logRequestAction(
            "REJECT_REQUEST",
            rejectedBy,
            request.getEmployeeName(),
            id,
            details
        );
        
        return saved;
    }
}
