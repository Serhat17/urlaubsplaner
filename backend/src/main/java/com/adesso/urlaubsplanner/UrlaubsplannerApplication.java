package com.adesso.urlaubsplanner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Application Class for Employee Vacation Management System
 * 
 * @author Serhat Bilge
 * @version 1.0.0
 */
@SpringBootApplication
public class UrlaubsplannerApplication {

    public static void main(String[] args) {
        SpringApplication.run(UrlaubsplannerApplication.class, args);

        System.out.println("===========================================");
        System.out.println("Built by: Serhat Bilge");
        System.out.println("GitHub: https://github.com/Serhat17");
        System.out.println("===========================================");
    }
}
