package com.adesso.urlaubsplanner.repository;

import com.adesso.urlaubsplanner.model.Region;
import com.adesso.urlaubsplanner.model.Role;
import com.adesso.urlaubsplanner.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for User entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    boolean existsByUsername(String username);
    
    List<User> findByRegion(Region region);
    
    List<User> findByRegionAndRole(Region region, Role role);
}
