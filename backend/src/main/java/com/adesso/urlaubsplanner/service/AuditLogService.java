package com.adesso.urlaubsplanner.service;

import com.adesso.urlaubsplanner.model.AuditLog;
import com.adesso.urlaubsplanner.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service for audit logging
 */
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    /**
     * Log a generic action
     */
    @Transactional
    public void logAction(String action, String performedBy, String details) {
        AuditLog log = new AuditLog(action, performedBy, details);
        auditLogRepository.save(log);
    }

    /**
     * Log a vacation request action
     */
    @Transactional
    public void logRequestAction(String action, String performedBy, String targetUser, Long requestId, String details) {
        AuditLog log = new AuditLog(action, performedBy, targetUser, requestId, details);
        auditLogRepository.save(log);
    }

    /**
     * Get all audit logs (Super Manager only)
     */
    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }

    /**
     * Get logs by performer
     */
    public List<AuditLog> getLogsByPerformer(String username) {
        return auditLogRepository.findByPerformedByOrderByTimestampDesc(username);
    }

    /**
     * Get logs by target user
     */
    public List<AuditLog> getLogsByTargetUser(String username) {
        return auditLogRepository.findByTargetUserOrderByTimestampDesc(username);
    }

    /**
     * Get logs by action type
     */
    public List<AuditLog> getLogsByAction(String action) {
        return auditLogRepository.findByActionOrderByTimestampDesc(action);
    }

    /**
     * Get logs within date range
     */
    public List<AuditLog> getLogsByDateRange(LocalDateTime start, LocalDateTime end) {
        return auditLogRepository.findByTimestampBetweenOrderByTimestampDesc(start, end);
    }
}
