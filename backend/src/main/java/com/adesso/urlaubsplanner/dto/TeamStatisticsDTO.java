package com.adesso.urlaubsplanner.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for team statistics (per employee)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamStatisticsDTO {
    private Long userId;
    private String username;
    private String fullName;
    private Integer totalVacationDays;
    private Integer usedVacationDays;
    private Integer remainingVacationDays;
    private Integer sickDays;
    private Integer homeOfficeDays;
    private Integer businessTripDays;
    private Integer trainingDays;
    private String regionName;
}
