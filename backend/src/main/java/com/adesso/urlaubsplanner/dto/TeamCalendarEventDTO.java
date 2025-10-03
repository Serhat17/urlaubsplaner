package com.adesso.urlaubsplanner.dto;

import com.adesso.urlaubsplanner.model.AbsenceType;
import com.adesso.urlaubsplanner.model.VacationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO for calendar events (absences)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamCalendarEventDTO {
    private Long id;
    private String employeeName;
    private String employeeFullName;
    private LocalDate startDate;
    private LocalDate endDate;
    private AbsenceType absenceType;
    private VacationStatus status;
    private String representativeName;
    private Long daysRequested;
}
