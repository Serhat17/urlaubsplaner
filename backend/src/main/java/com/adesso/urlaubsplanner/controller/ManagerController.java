package com.adesso.urlaubsplanner.controller;

import com.adesso.urlaubsplanner.dto.TeamCalendarEventDTO;
import com.adesso.urlaubsplanner.dto.TeamStatisticsDTO;
import com.adesso.urlaubsplanner.model.User;
import com.adesso.urlaubsplanner.service.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for Manager-specific endpoints
 */
@RestController
@RequestMapping("/api/manager")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;

    /**
     * Get team members in manager's region
     * GET /api/manager/team
     */
    @GetMapping("/team")
    @PreAuthorize("hasRole('MANAGER') or hasRole('SUPER_MANAGER')")
    public ResponseEntity<List<User>> getTeamMembers(Authentication authentication) {
        String username = authentication.getName();
        List<User> team = managerService.getEmployeesInManagerRegion(username);
        return ResponseEntity.ok(team);
    }

    /**
     * Get team statistics (vacation days, sick days, etc.)
     * GET /api/manager/team/statistics
     */
    @GetMapping("/team/statistics")
    @PreAuthorize("hasRole('MANAGER') or hasRole('SUPER_MANAGER')")
    public ResponseEntity<List<TeamStatisticsDTO>> getTeamStatistics(Authentication authentication) {
        String username = authentication.getName();
        List<TeamStatisticsDTO> statistics = managerService.getTeamStatistics(username);
        return ResponseEntity.ok(statistics);
    }

    /**
     * Get team calendar (approved and pending absences)
     * GET /api/manager/team/calendar?startDate=2024-01-01&endDate=2024-12-31
     */
    @GetMapping("/team/calendar")
    @PreAuthorize("hasRole('MANAGER') or hasRole('SUPER_MANAGER')")
    public ResponseEntity<List<TeamCalendarEventDTO>> getTeamCalendar(
            Authentication authentication,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        String username = authentication.getName();
        List<TeamCalendarEventDTO> events = managerService.getTeamCalendar(username, startDate, endDate);
        return ResponseEntity.ok(events);
    }

    /**
     * Get team overload warnings (days with too many absences)
     * GET /api/manager/team/overload
     */
    @GetMapping("/team/overload")
    @PreAuthorize("hasRole('MANAGER') or hasRole('SUPER_MANAGER')")
    public ResponseEntity<Map<LocalDate, Integer>> getTeamOverloadWarnings(Authentication authentication) {
        String username = authentication.getName();
        Map<LocalDate, Integer> warnings = managerService.getTeamOverloadWarnings(username);
        return ResponseEntity.ok(warnings);
    }
}
