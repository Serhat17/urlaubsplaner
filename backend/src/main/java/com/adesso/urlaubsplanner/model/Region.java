package com.adesso.urlaubsplanner.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing a regional office/location
 */
@Entity
@Table(name = "regions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column
    private String city;

    @Column
    private String country = "Deutschland";

    @Column
    private Boolean active = true;

    public Region(String name, String city) {
        this.name = name;
        this.city = city;
    }
}
