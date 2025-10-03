package com.adesso.urlaubsplanner.controller;

import com.adesso.urlaubsplanner.model.AuditLog;
import com.adesso.urlaubsplanner.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * REST Controller for audit log endpoints (SUPER_MANAGER only)
 */
@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    /**
     * Get all audit logs (SUPER_MANAGER only)
     * GET /api/audit/logs
     */
    @GetMapping("/logs")
    @PreAuthorize("hasRole('SUPER_MANAGER')")
    public ResponseEntity<List<AuditLog>> getAllLogs() {
        List<AuditLog> logs = auditLogService.getAllLogs();
        return ResponseEntity.ok(logs);
    }

    /**
     * Get logs by performer
     * GET /api/audit/logs/performer/{username}
     */
    @GetMapping("/logs/performer/{username}")
    @PreAuthorize("hasRole('SUPER_MANAGER')")
    public ResponseEntity<List<AuditLog>> getLogsByPerformer(@PathVariable String username) {
        List<AuditLog> logs = auditLogService.getLogsByPerformer(username);
        return ResponseEntity.ok(logs);
    }

    /**
     * Get logs by target user
     * GET /api/audit/logs/target/{username}
     */
    @GetMapping("/logs/target/{username}")
    @PreAuthorize("hasRole('SUPER_MANAGER')")
    public ResponseEntity<List<AuditLog>> getLogsByTargetUser(@PathVariable String username) {
        List<AuditLog> logs = auditLogService.getLogsByTargetUser(username);
        return ResponseEntity.ok(logs);
    }

    /**
     * Get logs by action type
     * GET /api/audit/logs/action/{action}
     */
    @GetMapping("/logs/action/{action}")
    @PreAuthorize("hasRole('SUPER_MANAGER')")
    public ResponseEntity<List<AuditLog>> getLogsByAction(@PathVariable String action) {
        List<AuditLog> logs = auditLogService.getLogsByAction(action);
        return ResponseEntity.ok(logs);
    }

    /**
     * Get logs within date range
     * GET /api/audit/logs/range?start=...&end=...
     */
    @GetMapping("/logs/range")
    @PreAuthorize("hasRole('SUPER_MANAGER')")
    public ResponseEntity<List<AuditLog>> getLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<AuditLog> logs = auditLogService.getLogsByDateRange(start, end);
        return ResponseEntity.ok(logs);
    }

    /**
     * Export audit logs to CSV
     * GET /api/audit/logs/export/csv
     */
    @GetMapping(value = "/logs/export/csv", produces = "text/csv")
    @PreAuthorize("hasRole('SUPER_MANAGER')")
    public ResponseEntity<String> exportLogsToCSV() {
        List<AuditLog> logs = auditLogService.getAllLogs();
        
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Timestamp,Action,Performed By,Target User,Request ID,Details\n");
        
        for (AuditLog log : logs) {
            csv.append(log.getId()).append(",")
               .append(log.getTimestamp()).append(",")
               .append(log.getAction()).append(",")
               .append(log.getPerformedBy()).append(",")
               .append(log.getTargetUser() != null ? log.getTargetUser() : "").append(",")
               .append(log.getRequestId() != null ? log.getRequestId() : "").append(",")
               .append(log.getDetails() != null ? log.getDetails().replace(",", ";") : "")
               .append("\n");
        }
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "audit-logs.csv");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(csv.toString());
    }
}
