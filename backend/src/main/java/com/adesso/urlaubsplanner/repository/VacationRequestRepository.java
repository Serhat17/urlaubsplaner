package com.adesso.urlaubsplanner.repository;

import com.adesso.urlaubsplanner.model.VacationRequest;
import com.adesso.urlaubsplanner.model.VacationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for VacationRequest entity
 */
@Repository
public interface VacationRequestRepository extends JpaRepository<VacationRequest, Long> {
    
    List<VacationRequest> findByEmployeeName(String employeeName);
    
    List<VacationRequest> findByEmployeeNameAndStatus(String employeeName, VacationStatus status);
    
    List<VacationRequest> findAllByOrderByCreatedAtDesc();
    
    /**
     * Find all vacation requests for employees in a specific region
     */
    @Query("SELECT vr FROM VacationRequest vr JOIN User u ON vr.employeeName = u.username WHERE u.region.id = :regionId ORDER BY vr.createdAt DESC")
    List<VacationRequest> findByEmployeeRegion(@Param("regionId") Long regionId);
}
