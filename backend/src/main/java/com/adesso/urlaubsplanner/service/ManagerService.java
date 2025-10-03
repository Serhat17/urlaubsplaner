package com.adesso.urlaubsplanner.service;

import com.adesso.urlaubsplanner.dto.TeamCalendarEventDTO;
import com.adesso.urlaubsplanner.dto.TeamStatisticsDTO;
import com.adesso.urlaubsplanner.model.*;
import com.adesso.urlaubsplanner.repository.UserRepository;
import com.adesso.urlaubsplanner.repository.VacationRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for Manager-specific operations with region-based access control
 */
@Service
@RequiredArgsConstructor
public class ManagerService {

    private final UserRepository userRepository;
    private final VacationRequestRepository vacationRequestRepository;

    /**
     * Get vacation requests for employees in the manager's region
     * Super Managers see all requests
     */
    public List<VacationRequest> getVacationRequestsForManagerRegion(String managerUsername) {
        User manager = userRepository.findByUsername(managerUsername)
                .orElseThrow(() -> new IllegalArgumentException("Manager not found: " + managerUsername));

        // Super Managers see all requests
        if (manager.getRole().name().equals("SUPER_MANAGER")) {
            return vacationRequestRepository.findAllByOrderByCreatedAtDesc();
        }

        // Regular Managers only see requests from their region
        Region managerRegion = manager.getRegion();
        if (managerRegion == null) {
            throw new IllegalStateException("Manager must be assigned to a region: " + managerUsername);
        }

        return vacationRequestRepository.findByEmployeeRegion(managerRegion.getId());
    }

    /**
     * Get all employees in the manager's region
     */
    public List<User> getEmployeesInManagerRegion(String managerUsername) {
        User manager = userRepository.findByUsername(managerUsername)
                .orElseThrow(() -> new IllegalArgumentException("Manager not found: " + managerUsername));

        // Super Managers see all employees
        if (manager.getRole().name().equals("SUPER_MANAGER")) {
            return userRepository.findAll();
        }

        // Regular Managers only see employees from their region
        Region managerRegion = manager.getRegion();
        if (managerRegion == null) {
            throw new IllegalStateException("Manager must be assigned to a region: " + managerUsername);
        }

        return userRepository.findByRegion(managerRegion);
    }

    /**
     * Check if a manager has access to a specific vacation request
     */
    public boolean hasAccessToRequest(String managerUsername, Long requestId) {
        User manager = userRepository.findByUsername(managerUsername)
                .orElseThrow(() -> new IllegalArgumentException("Manager not found: " + managerUsername));

        VacationRequest request = vacationRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found: " + requestId));

        // Super Managers have access to all requests
        if (manager.getRole().name().equals("SUPER_MANAGER")) {
            return true;
        }

        // Get employee who made the request
        User employee = userRepository.findByUsername(request.getEmployeeName())
                .orElse(null);

        if (employee == null) {
            return false;
        }

        // Check if both manager and employee are in the same region
        Region managerRegion = manager.getRegion();
        Region employeeRegion = employee.getRegion();

        if (managerRegion == null || employeeRegion == null) {
            return false;
        }

        return managerRegion.getId().equals(employeeRegion.getId());
    }

    /**
     * Get team statistics for employees in manager's region
     */
    public List<TeamStatisticsDTO> getTeamStatistics(String managerUsername) {
        List<User> employees = getEmployeesInManagerRegion(managerUsername);
        
        return employees.stream()
                .filter(emp -> emp.getRole() == Role.EMPLOYEE || emp.getRole() == Role.MANAGER)
                .map(emp -> {
                    // Get all approved requests for this employee
                    List<VacationRequest> requests = vacationRequestRepository.findByEmployeeName(emp.getUsername());
                    
                    // Calculate days by type
                    Map<AbsenceType, Integer> daysByType = new HashMap<>();
                    for (AbsenceType type : AbsenceType.values()) {
                        daysByType.put(type, 0);
                    }
                    
                    for (VacationRequest req : requests) {
                        if (req.getStatus() == VacationStatus.APPROVED) {
                            AbsenceType type = req.getAbsenceType();
                            daysByType.put(type, daysByType.get(type) + req.getDaysRequested().intValue());
                        }
                    }
                    
                    TeamStatisticsDTO dto = new TeamStatisticsDTO();
                    dto.setUserId(emp.getId());
                    dto.setUsername(emp.getUsername());
                    dto.setFullName(emp.getFullName());
                    dto.setTotalVacationDays(emp.getTotalVacationDays());
                    dto.setUsedVacationDays(emp.getUsedVacationDays());
                    dto.setRemainingVacationDays(emp.getRemainingVacationDays());
                    dto.setSickDays(daysByType.get(AbsenceType.SICK_LEAVE));
                    dto.setHomeOfficeDays(daysByType.get(AbsenceType.HOME_OFFICE));
                    dto.setBusinessTripDays(daysByType.get(AbsenceType.BUSINESS_TRIP));
                    dto.setTrainingDays(daysByType.get(AbsenceType.TRAINING));
                    dto.setRegionName(emp.getRegion() != null ? emp.getRegion().getName() : "Global");
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Get team calendar events for manager's region
     */
    public List<TeamCalendarEventDTO> getTeamCalendar(String managerUsername, LocalDate startDate, LocalDate endDate) {
        List<VacationRequest> requests = getVacationRequestsForManagerRegion(managerUsername);
        
        return requests.stream()
                .filter(req -> {
                    // Filter by date range if provided
                    if (startDate != null && req.getEndDate().isBefore(startDate)) {
                        return false;
                    }
                    if (endDate != null && req.getStartDate().isAfter(endDate)) {
                        return false;
                    }
                    return req.getStatus() == VacationStatus.APPROVED || req.getStatus() == VacationStatus.PENDING;
                })
                .map(req -> {
                    User employee = userRepository.findByUsername(req.getEmployeeName()).orElse(null);
                    
                    TeamCalendarEventDTO dto = new TeamCalendarEventDTO();
                    dto.setId(req.getId());
                    dto.setEmployeeName(req.getEmployeeName());
                    dto.setEmployeeFullName(employee != null ? employee.getFullName() : req.getEmployeeName());
                    dto.setStartDate(req.getStartDate());
                    dto.setEndDate(req.getEndDate());
                    dto.setAbsenceType(req.getAbsenceType());
                    dto.setStatus(req.getStatus());
                    dto.setRepresentativeName(req.getRepresentativeName());
                    dto.setDaysRequested(req.getDaysRequested());
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Check for team overload (too many absences on same dates)
     */
    public Map<LocalDate, Integer> getTeamOverloadWarnings(String managerUsername) {
        List<VacationRequest> requests = getVacationRequestsForManagerRegion(managerUsername);
        List<User> teamMembers = getEmployeesInManagerRegion(managerUsername);
        
        int teamSize = teamMembers.size();
        Map<LocalDate, Integer> absencesPerDay = new HashMap<>();
        
        for (VacationRequest req : requests) {
            if (req.getStatus() == VacationStatus.APPROVED || req.getStatus() == VacationStatus.PENDING) {
                LocalDate current = req.getStartDate();
                while (!current.isAfter(req.getEndDate())) {
                    absencesPerDay.put(current, absencesPerDay.getOrDefault(current, 0) + 1);
                    current = current.plusDays(1);
                }
            }
        }
        
        // Return days where >50% of team is absent
        int threshold = (int) Math.ceil(teamSize * 0.5);
        return absencesPerDay.entrySet().stream()
                .filter(entry -> entry.getValue() >= threshold)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }
}
