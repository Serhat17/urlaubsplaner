package com.adesso.urlaubsplanner.dto;

import com.adesso.urlaubsplanner.model.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating/updating users
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    @NotBlank(message = "Username is required")
    private String username;

    private String password; // Optional for updates

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotNull(message = "Role is required")
    private Role role;

    private Integer totalVacationDays = 30;

    private Integer usedVacationDays = 0;

    private Boolean active = true;

    private Long regionId;
}
