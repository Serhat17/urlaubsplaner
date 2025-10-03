package com.adesso.urlaubsplanner.service;

import com.adesso.urlaubsplanner.dto.StatisticsDTO;
import com.adesso.urlaubsplanner.dto.UserDTO;
import com.adesso.urlaubsplanner.model.Region;
import com.adesso.urlaubsplanner.model.Role;
import com.adesso.urlaubsplanner.model.User;
import com.adesso.urlaubsplanner.model.VacationRequest;
import com.adesso.urlaubsplanner.repository.RegionRepository;
import com.adesso.urlaubsplanner.repository.UserRepository;
import com.adesso.urlaubsplanner.repository.VacationRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for Super Manager admin operations
 */
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final RegionRepository regionRepository;
    private final VacationRequestRepository vacationRequestRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    /**
     * Get all users in the system
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Get user by ID
     */
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
    }

    /**
     * Create a new user
     */
    @Transactional
    public User createUser(UserDTO dto, String createdBy) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new IllegalArgumentException("Username already exists: " + dto.getUsername());
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setFullName(dto.getFullName());
        user.setRole(dto.getRole());
        user.setTotalVacationDays(dto.getTotalVacationDays());
        user.setUsedVacationDays(dto.getUsedVacationDays());
        user.setActive(dto.getActive());
        
        // Set region if provided
        if (dto.getRegionId() != null) {
            Region region = regionRepository.findById(dto.getRegionId())
                    .orElseThrow(() -> new IllegalArgumentException("Region not found: " + dto.getRegionId()));
            user.setRegion(region);
        }

        User saved = userRepository.save(user);

        // Audit log
        String regionInfo = saved.getRegion() != null ? " in region " + saved.getRegion().getName() : "";
        auditLogService.logAction(
            "CREATE_USER",
            createdBy,
            String.format("Created new user: %s (Role: %s)%s", dto.getUsername(), dto.getRole(), regionInfo)
        );

        return saved;
    }

    /**
     * Update an existing user
     */
    @Transactional
    public User updateUser(Long id, UserDTO dto, String updatedBy) {
        User user = getUserById(id);

        user.setFullName(dto.getFullName());
        user.setRole(dto.getRole());
        user.setTotalVacationDays(dto.getTotalVacationDays());
        user.setUsedVacationDays(dto.getUsedVacationDays());
        user.setActive(dto.getActive());

        // Update region if provided
        if (dto.getRegionId() != null) {
            Region region = regionRepository.findById(dto.getRegionId())
                    .orElseThrow(() -> new IllegalArgumentException("Region not found: " + dto.getRegionId()));
            user.setRegion(region);
        }

        // Update password only if provided
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        User saved = userRepository.save(user);

        // Audit log
        String regionInfo = saved.getRegion() != null ? " in region " + saved.getRegion().getName() : "";
        auditLogService.logAction(
            "UPDATE_USER",
            updatedBy,
            String.format("Updated user: %s (Role: %s)%s", user.getUsername(), user.getRole(), regionInfo)
        );

        return saved;
    }

    /**
     * Deactivate a user (soft delete)
     */
    @Transactional
    public void deactivateUser(Long id, String deactivatedBy) {
        User user = getUserById(id);
        
        if (user.getRole() == Role.SUPER_MANAGER) {
            throw new IllegalStateException("Cannot deactivate Super Manager");
        }

        user.setActive(false);
        userRepository.save(user);

        // Audit log
        auditLogService.logAction(
            "DEACTIVATE_USER",
            deactivatedBy,
            String.format("Deactivated user: %s", user.getUsername())
        );
    }

    /**
     * Delete a user (hard delete)
     */
    @Transactional
    public void deleteUser(Long id, String deletedBy) {
        User user = getUserById(id);
        
        if (user.getRole() == Role.SUPER_MANAGER) {
            throw new IllegalStateException("Cannot delete Super Manager");
        }

        userRepository.delete(user);

        // Audit log
        auditLogService.logAction(
            "DELETE_USER",
            deletedBy,
            String.format("Deleted user: %s", user.getUsername())
        );
    }

    /**
     * Update vacation quota for a user
     */
    @Transactional
    public User updateVacationQuota(Long id, Integer totalDays, String updatedBy) {
        User user = getUserById(id);
        
        Integer oldQuota = user.getTotalVacationDays();
        user.setTotalVacationDays(totalDays);
        User saved = userRepository.save(user);

        // Audit log
        auditLogService.logAction(
            "UPDATE_QUOTA",
            updatedBy,
            String.format("Updated vacation quota for %s: %d → %d days", 
                user.getUsername(), oldQuota, totalDays)
        );

        return saved;
    }

    /**
     * Get comprehensive system statistics
     */
    public StatisticsDTO getSystemStatistics() {
        StatisticsDTO stats = new StatisticsDTO();

        // User counts
        List<User> allUsers = userRepository.findAll();
        stats.setTotalUsers((long) allUsers.size());
        stats.setTotalEmployees(allUsers.stream().filter(u -> u.getRole() == Role.EMPLOYEE).count());
        stats.setTotalManagers(allUsers.stream().filter(u -> u.getRole() == Role.MANAGER).count());

        // Request counts
        List<VacationRequest> allRequests = vacationRequestRepository.findAll();
        stats.setTotalRequests((long) allRequests.size());
        stats.setPendingRequests(allRequests.stream()
                .filter(r -> r.getStatus().name().equals("PENDING")).count());
        stats.setApprovedRequests(allRequests.stream()
                .filter(r -> r.getStatus().name().equals("APPROVED")).count());
        stats.setRejectedRequests(allRequests.stream()
                .filter(r -> r.getStatus().name().equals("REJECTED")).count());

        // Average vacation days used
        if (!allUsers.isEmpty()) {
            double avgUsed = allUsers.stream()
                    .mapToInt(User::getUsedVacationDays)
                    .average()
                    .orElse(0.0);
            stats.setAverageVacationDaysUsed(Math.round(avgUsed * 100.0) / 100.0);
        }

        // Requests by absence type
        Map<String, Long> byType = allRequests.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getAbsenceType().getDisplayName(),
                        Collectors.counting()
                ));
        stats.setRequestsByAbsenceType(byType);

        // Requests by month
        Map<String, Long> byMonth = allRequests.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getCreatedAt().getMonth().toString(),
                        Collectors.counting()
                ));
        stats.setRequestsByMonth(byMonth);

        return stats;
    }

    /**
     * Get vacation usage report for all employees
     */
    public Map<String, Map<String, Object>> getVacationUsageReport() {
        List<User> employees = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.EMPLOYEE)
                .toList();

        Map<String, Map<String, Object>> report = new HashMap<>();

        for (User employee : employees) {
            Map<String, Object> userData = new HashMap<>();
            userData.put("fullName", employee.getFullName());
            userData.put("totalDays", employee.getTotalVacationDays());
            userData.put("usedDays", employee.getUsedVacationDays());
            userData.put("remainingDays", employee.getRemainingVacationDays());
            userData.put("usagePercentage", 
                (employee.getUsedVacationDays() * 100.0) / employee.getTotalVacationDays());

            report.put(employee.getUsername(), userData);
        }

        return report;
    }
}
