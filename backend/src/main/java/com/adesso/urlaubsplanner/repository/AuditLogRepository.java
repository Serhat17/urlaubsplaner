package com.adesso.urlaubsplanner.repository;

import com.adesso.urlaubsplanner.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for AuditLog entity
 */
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    List<AuditLog> findAllByOrderByTimestampDesc();
    
    List<AuditLog> findByPerformedByOrderByTimestampDesc(String performedBy);
    
    List<AuditLog> findByTargetUserOrderByTimestampDesc(String targetUser);
    
    List<AuditLog> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime start, LocalDateTime end);
    
    List<AuditLog> findByActionOrderByTimestampDesc(String action);
}
