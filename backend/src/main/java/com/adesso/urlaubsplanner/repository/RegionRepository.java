package com.adesso.urlaubsplanner.repository;

import com.adesso.urlaubsplanner.model.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Region entity
 */
@Repository
public interface RegionRepository extends JpaRepository<Region, Long> {
    
    Optional<Region> findByName(String name);
    
    boolean existsByName(String name);
}
