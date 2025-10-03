package com.adesso.urlaubsplanner.config;

import com.adesso.urlaubsplanner.model.Region;
import com.adesso.urlaubsplanner.model.Role;
import com.adesso.urlaubsplanner.model.User;
import com.adesso.urlaubsplanner.repository.RegionRepository;
import com.adesso.urlaubsplanner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Data loader to preload demo users and regions into the database
 */
@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RegionRepository regionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        System.out.println("========================================");
        System.out.println("🚀 Loading Demo Data (Regions & Users)...");
        System.out.println("========================================");
        
        // ===== CREATE REGIONS =====
        Region dortmund = createRegionIfNotExists("Dortmund", "Dortmund");
        Region munich = createRegionIfNotExists("München", "München");
        Region hamburg = createRegionIfNotExists("Hamburg", "Hamburg");
        
        System.out.println("\n📍 Regions created:");
        System.out.println("  ✓ Dortmund");
        System.out.println("  ✓ München");
        System.out.println("  ✓ Hamburg");
        
        // ===== EMPLOYEES (assigned to different regions) =====
        System.out.println("\n👥 Creating Users:");
        createUserIfNotExists("max.mustermann", "Max Mustermann", Role.EMPLOYEE, 30, 0, dortmund);
        createUserIfNotExists("sarah.mueller", "Sarah Müller", Role.EMPLOYEE, 30, 5, dortmund);
        createUserIfNotExists("thomas.schmidt", "Thomas Schmidt", Role.EMPLOYEE, 30, 10, munich);
        createUserIfNotExists("lisa.weber", "Lisa Weber", Role.EMPLOYEE, 30, 8, munich);
        createUserIfNotExists("peter.schneider", "Peter Schneider", Role.EMPLOYEE, 30, 12, hamburg);
        
        // Keep legacy username for backward compatibility
        createUserIfNotExists("employee", "Max Mustermann (Legacy)", Role.EMPLOYEE, 30, 0, dortmund);
        
        // ===== MANAGERS (each manages one region) =====
        createUserIfNotExists("anna.wagner", "Anna Wagner", Role.MANAGER, 30, 3, dortmund);
        createUserIfNotExists("michael.klein", "Michael Klein", Role.MANAGER, 30, 7, munich);
        
        // Keep legacy username for backward compatibility
        createUserIfNotExists("manager", "Anna Schmidt (Legacy)", Role.MANAGER, 30, 0, dortmund);
        
        // ===== SUPER MANAGER (sees all regions) =====
        createUserIfNotExists("admin", "System Administrator", Role.SUPER_MANAGER, 30, 0, null);
        
        System.out.println("\n========================================");
        System.out.println("✅ All demo data loaded successfully!");
        System.out.println("========================================");
        System.out.println("\n📋 Demo Credentials:");
        System.out.println("----------------------------------------");
        System.out.println("EMPLOYEES:");
        System.out.println("  🔹 Dortmund:");
        System.out.println("    • max.mustermann / password");
        System.out.println("    • sarah.mueller / password");
        System.out.println("  🔹 München:");
        System.out.println("    • thomas.schmidt / password");
        System.out.println("    • lisa.weber / password");
        System.out.println("  🔹 Hamburg:");
        System.out.println("    • peter.schneider / password");
        System.out.println("\nMANAGERS:");
        System.out.println("  🔹 anna.wagner / password (Dortmund Region)");
        System.out.println("  🔹 michael.klein / password (München Region)");
        System.out.println("\nSUPER MANAGER:");
        System.out.println("  🔹 admin / password (All Regions + Full Admin Access)");
        System.out.println("========================================\n");
    }
    
    private Region createRegionIfNotExists(String name, String city) {
        return regionRepository.findByName(name)
                .orElseGet(() -> {
                    Region region = new Region(name, city);
                    return regionRepository.save(region);
                });
    }
    
    private void createUserIfNotExists(String username, String fullName, Role role, 
                                      int totalDays, int usedDays, Region region) {
        if (!userRepository.existsByUsername(username)) {
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode("password"));
            user.setFullName(fullName);
            user.setRole(role);
            user.setTotalVacationDays(totalDays);
            user.setUsedVacationDays(usedDays);
            user.setRegion(region);
            userRepository.save(user);
            String regionInfo = region != null ? " (" + region.getName() + ")" : " (Global)";
            System.out.println(String.format("  ✓ Created %s: %s - %s%s", 
                role.name(), username, fullName, regionInfo));
        }
    }
}
