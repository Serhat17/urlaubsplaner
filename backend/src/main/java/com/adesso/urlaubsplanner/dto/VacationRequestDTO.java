package com.adesso.urlaubsplanner.dto;

import com.adesso.urlaubsplanner.model.AbsenceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO for creating vacation requests
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VacationRequestDTO {

    @NotBlank(message = "Employee name is required")
    private String employeeName;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotNull(message = "Absence type is required")
    private AbsenceType absenceType = AbsenceType.VACATION;

    private String notes;

    private String representativeName;  // Optional: employee covering during absence
}
