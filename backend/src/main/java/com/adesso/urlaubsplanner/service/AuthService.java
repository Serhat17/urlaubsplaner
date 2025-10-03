package com.adesso.urlaubsplanner.service;

import com.adesso.urlaubsplanner.dto.LoginRequest;
import com.adesso.urlaubsplanner.dto.LoginResponse;
import com.adesso.urlaubsplanner.model.User;
import com.adesso.urlaubsplanner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

/**
 * Service for authentication operations
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    /**
     * Authenticate user and return login response
     */
    public LoginResponse login(LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            User user = userRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return new LoginResponse(
                    user.getUsername(),
                    user.getFullName(),
                    user.getRole(),
                    user.getTotalVacationDays(),
                    user.getUsedVacationDays(),
                    user.getRemainingVacationDays(),
                    "Login successful"
            );
        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid username or password");
        }
    }
}
