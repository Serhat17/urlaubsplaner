package com.adesso.urlaubsplanner.controller;

import com.adesso.urlaubsplanner.dto.VacationRequestDTO;
import com.adesso.urlaubsplanner.model.VacationRequest;
import com.adesso.urlaubsplanner.service.ManagerService;
import com.adesso.urlaubsplanner.service.VacationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for vacation request endpoints
 */
@RestController
@RequestMapping("/api/vacations")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class VacationController {

    private final VacationService vacationService;
    private final ManagerService managerService;

    /**
     * Create a new vacation request (EMPLOYEE role)
     * POST /api/vacations
     */
    @PostMapping
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<?> createVacationRequest(@Valid @RequestBody VacationRequestDTO dto) {
        try {
            VacationRequest request = vacationService.createVacationRequest(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(request);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Get vacation requests filtered by manager's region
     * Regular managers only see requests from their region
     * Super managers see all requests
     * GET /api/vacations
     */
    @GetMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('SUPER_MANAGER')")
    public ResponseEntity<List<VacationRequest>> getAllVacationRequests(Authentication authentication) {
        String username = authentication.getName();
        List<VacationRequest> requests = managerService.getVacationRequestsForManagerRegion(username);
        return ResponseEntity.ok(requests);
    }

    /**
     * Get vacation requests for a specific employee
     * GET /api/vacations/employee/{name}
     */
    @GetMapping("/employee/{name}")
    public ResponseEntity<List<VacationRequest>> getVacationRequestsByEmployee(@PathVariable String name) {
        List<VacationRequest> requests = vacationService.getVacationRequestsByEmployee(name);
        return ResponseEntity.ok(requests);
    }

    /**
     * Approve a vacation request (MANAGER role)
     * Managers can only approve requests from their region
     * PUT /api/vacations/{id}/approve?reason=...
     */
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('MANAGER') or hasRole('SUPER_MANAGER')")
    public ResponseEntity<?> approveVacationRequest(@PathVariable Long id, 
                                                     @RequestParam(required = false) String reason,
                                                     Authentication authentication) {
        try {
            String username = authentication.getName();
            
            // Check if manager has access to this request
            if (!managerService.hasAccessToRequest(username, id)) {
                return ResponseEntity.status(403).body("Sie haben keinen Zugriff auf diese Anfrage (außerhalb Ihrer Region)");
            }
            
            VacationRequest request = vacationService.approveVacationRequest(id, username, reason);
            return ResponseEntity.ok(request);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Reject a vacation request (MANAGER role)
     * Managers can only reject requests from their region
     * PUT /api/vacations/{id}/reject?reason=...
     */
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('MANAGER') or hasRole('SUPER_MANAGER')")
    public ResponseEntity<?> rejectVacationRequest(@PathVariable Long id,
                                                    @RequestParam(required = false) String reason,
                                                    Authentication authentication) {
        try {
            String username = authentication.getName();
            
            // Check if manager has access to this request
            if (!managerService.hasAccessToRequest(username, id)) {
                return ResponseEntity.status(403).body("Sie haben keinen Zugriff auf diese Anfrage (außerhalb Ihrer Region)");
            }
            
            VacationRequest request = vacationService.rejectVacationRequest(id, username, reason);
            return ResponseEntity.ok(request);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
