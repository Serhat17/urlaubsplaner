package com.adesso.urlaubsplanner.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * DTO for system statistics
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsDTO {
    
    private Long totalUsers;
    private Long totalEmployees;
    private Long totalManagers;
    private Long totalRequests;
    private Long pendingRequests;
    private Long approvedRequests;
    private Long rejectedRequests;
    private Double averageVacationDaysUsed;
    private Map<String, Long> requestsByAbsenceType;
    private Map<String, Long> requestsByMonth;
}
