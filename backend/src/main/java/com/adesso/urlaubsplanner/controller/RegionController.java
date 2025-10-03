package com.adesso.urlaubsplanner.controller;

import com.adesso.urlaubsplanner.model.Region;
import com.adesso.urlaubsplanner.repository.RegionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Region endpoints
 */
@RestController
@RequestMapping("/api/regions")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class RegionController {

    private final RegionRepository regionRepository;

    /**
     * Get all regions
     * GET /api/regions
     */
    @GetMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('SUPER_MANAGER')")
    public ResponseEntity<List<Region>> getAllRegions() {
        List<Region> regions = regionRepository.findAll();
        return ResponseEntity.ok(regions);
    }

    /**
     * Get region by ID
     * GET /api/regions/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('SUPER_MANAGER')")
    public ResponseEntity<Region> getRegionById(@PathVariable Long id) {
        return regionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
