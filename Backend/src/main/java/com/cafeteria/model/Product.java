package com.cafeteria.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @jakarta.validation.constraints.NotBlank(message = "Name is required")
    @jakarta.validation.constraints.Size(min = 3, message = "Name must be at least 3 characters")
    @Column(nullable = false)
    private String name;
    
    @jakarta.validation.constraints.Size(min = 10, message = "Description must be at least 10 characters")
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @jakarta.validation.constraints.NotNull(message = "Price is required")
    @jakarta.validation.constraints.Min(value = 0, message = "Price must be positive")
    @Column(nullable = false)
    private Double price;
    
    @Column(columnDefinition = "TEXT")
    private String imageUrl;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnoreProperties("products")
    private Category category;
    
    @Transient
    private Long categoryId;
    
    @PostLoad
    private void setCategoryId() {
        if (category != null) {
            this.categoryId = category.getId();
        }
    }

    public Long getCategoryId() {
        if (category != null) {
            return category.getId();
        }
        return categoryId;
    }
    
    public Product(String name, String description, Double price, String imageUrl, Category category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category;
    }
}
