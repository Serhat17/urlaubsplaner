package com.adesso.urlaubsplanner.model;

/**
 * Enum representing different types of absences
 */
public enum AbsenceType {
    VACATION("Urlaub", "#3B82F6"),           // Blue
    SICK_LEAVE("Krankmeldung", "#EF4444"),   // Red
    HOME_OFFICE("Home Office", "#10B981"),   // Green
    BUSINESS_TRIP("Dienstreise", "#F59E0B"), // Orange
    TRAINING("Schulung", "#8B5CF6");         // Purple

    private final String displayName;
    private final String color;

    AbsenceType(String displayName, String color) {
        this.displayName = displayName;
        this.color = color;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getColor() {
        return color;
    }
}
