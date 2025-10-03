package com.adesso.urlaubsplanner.controller;

import com.adesso.urlaubsplanner.dto.StatisticsDTO;
import com.adesso.urlaubsplanner.dto.UserDTO;
import com.adesso.urlaubsplanner.model.User;
import com.adesso.urlaubsplanner.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for Super Manager admin operations
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_MANAGER')")
public class AdminController {

    private final AdminService adminService;

    /**
     * Get all users
     * GET /api/admin/users
     */
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Get user by ID
     * GET /api/admin/users/{id}
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        try {
            User user = adminService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Create new user
     * POST /api/admin/users
     */
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@Valid @RequestBody UserDTO dto, Authentication authentication) {
        try {
            String createdBy = authentication.getName();
            User user = adminService.createUser(dto, createdBy);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Update user
     * PUT /api/admin/users/{id}
     */
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody UserDTO dto, 
                                       Authentication authentication) {
        try {
            String updatedBy = authentication.getName();
            User user = adminService.updateUser(id, dto, updatedBy);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Deactivate user
     * PUT /api/admin/users/{id}/deactivate
     */
    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<?> deactivateUser(@PathVariable Long id, Authentication authentication) {
        try {
            String deactivatedBy = authentication.getName();
            adminService.deactivateUser(id, deactivatedBy);
            return ResponseEntity.ok().body("User deactivated successfully");
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Delete user
     * DELETE /api/admin/users/{id}
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, Authentication authentication) {
        try {
            String deletedBy = authentication.getName();
            adminService.deleteUser(id, deletedBy);
            return ResponseEntity.ok().body("User deleted successfully");
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Update vacation quota for user
     * PUT /api/admin/users/{id}/quota
     */
    @PutMapping("/users/{id}/quota")
    public ResponseEntity<?> updateVacationQuota(@PathVariable Long id, 
                                                 @RequestParam Integer totalDays,
                                                 Authentication authentication) {
        try {
            String updatedBy = authentication.getName();
            User user = adminService.updateVacationQuota(id, totalDays, updatedBy);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Get system statistics
     * GET /api/admin/statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<StatisticsDTO> getStatistics() {
        StatisticsDTO stats = adminService.getSystemStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * Get vacation usage report
     * GET /api/admin/reports/vacation-usage
     */
    @GetMapping("/reports/vacation-usage")
    public ResponseEntity<Map<String, Map<String, Object>>> getVacationUsageReport() {
        Map<String, Map<String, Object>> report = adminService.getVacationUsageReport();
        return ResponseEntity.ok(report);
    }
}
