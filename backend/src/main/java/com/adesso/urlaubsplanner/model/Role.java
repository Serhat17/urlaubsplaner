package com.adesso.urlaubsplanner.model;

/**
 * Enum representing user roles in the system
 */
public enum Role {
    EMPLOYEE,      // Can create and view own requests
    MANAGER,       // Can view all requests and approve/reject
    SUPER_MANAGER  // Full admin rights + audit log access
}
