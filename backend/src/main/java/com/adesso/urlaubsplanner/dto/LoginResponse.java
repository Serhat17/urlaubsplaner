package com.adesso.urlaubsplanner.dto;

import com.adesso.urlaubsplanner.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for login responses
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String username;
    private String fullName;
    private Role role;
    private Integer totalVacationDays;
    private Integer usedVacationDays;
    private Integer remainingVacationDays;
    private String message;
}
