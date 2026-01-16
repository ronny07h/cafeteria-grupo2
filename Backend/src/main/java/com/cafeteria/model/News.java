package com.cafeteria.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "news")
public class News {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @jakarta.validation.constraints.NotBlank(message = "Title is required")
    @jakarta.validation.constraints.Size(min = 3, message = "Title must be at least 3 characters")
    @Column(nullable = false)
    private String title;
    
    @jakarta.validation.constraints.NotBlank(message = "Content is required")
    @jakarta.validation.constraints.Size(min = 5, message = "Content must be at least 5 characters")
    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    private LocalDateTime publicationDate;

    @PrePersist
    protected void onCreate() {
        if (publicationDate == null) {
            publicationDate = LocalDateTime.now();
        }
    }
}
