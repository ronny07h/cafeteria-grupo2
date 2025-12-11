package com.cafeteria;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CafeteriaApplication {

    public static void main(String[] args) {
        SpringApplication.run(CafeteriaApplication.class, args);
        System.out.println("\n========================================");
        System.out.println(" Cafeteria Backend is running!");
        System.out.println(" API: http://localhost:9090/api");
        System.out.println(" H2 Console: http://localhost:9090/h2-console");
        System.out.println("========================================\n");
    }
}
