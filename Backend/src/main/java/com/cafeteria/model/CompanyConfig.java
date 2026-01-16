package com.cafeteria.model;

import jakarta.persistence.*;

@Entity
@Table(name = "company_config")
public class CompanyConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @jakarta.validation.constraints.NotBlank(message = "Company name is required")
    @jakarta.validation.constraints.Size(min = 3, message = "Company name must be at least 3 characters")
    private String name;

    public CompanyConfig() {
    }

    public CompanyConfig(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
