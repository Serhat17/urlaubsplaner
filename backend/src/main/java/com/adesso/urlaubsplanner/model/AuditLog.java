package com.adesso.urlaubsplanner.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity for tracking all system actions for audit purposes
 */
@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String action;  // CREATE_REQUEST, APPROVE_REQUEST, REJECT_REQUEST, CANCEL_REQUEST, LOGIN, LOGOUT

    @Column(nullable = false)
    private String performedBy;  // Username of user who performed the action

    @Column
    private String targetUser;  // Username affected by the action (for requests)

    @Column
    private Long requestId;  // ID of vacation request (if applicable)

    @Column(length = 1000)
    private String details;  // Additional details about the action

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    @Column
    private String ipAddress;  // IP address of the user (optional)

    public AuditLog(String action, String performedBy, String details) {
        this.action = action;
        this.performedBy = performedBy;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }

    public AuditLog(String action, String performedBy, String targetUser, Long requestId, String details) {
        this.action = action;
        this.performedBy = performedBy;
        this.targetUser = targetUser;
        this.requestId = requestId;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }
}
