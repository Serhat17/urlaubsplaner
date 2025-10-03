package com.adesso.urlaubsplanner.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * Entity representing a vacation request
 */
@Entity
@Table(name = "vacation_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VacationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String employeeName;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VacationStatus status = VacationStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AbsenceType absenceType = AbsenceType.VACATION;

    @Column
    private String notes;

    @Column
    private String representativeName;  // Employee covering during absence

    @Column
    private String approvalReason;  // Manager's reason for approval/rejection

    @Column
    private String approvedBy;  // Manager who approved/rejected

    @Column(nullable = false)
    private LocalDate createdAt = LocalDate.now();

    /**
     * Calculate the number of vacation days requested
     * Includes both start and end dates
     */
    public Long getDaysRequested() {
        return ChronoUnit.DAYS.between(startDate, endDate) + 1;
    }
}
