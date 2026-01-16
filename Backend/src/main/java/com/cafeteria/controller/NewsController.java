package com.cafeteria.controller;

import com.cafeteria.model.News;
import com.cafeteria.service.NewsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "*") // Adjust as needed based on global config
public class NewsController {

    @Autowired
    private NewsService newsService;

    @GetMapping
    public List<News> getAllNews() {
        return newsService.getAllNews();
    }

    @GetMapping("/{id}")
    public ResponseEntity<News> getNewsById(@PathVariable Long id) {
        return newsService.getNewsById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<News> createNews(@Valid @RequestBody News news) {
        News createdNews = newsService.saveNews(news); // Assuming saveNews is the correct method in service
        return ResponseEntity.status(HttpStatus.CREATED).body(createdNews);
    }

    @PutMapping("/{id}")
    public ResponseEntity<News> updateNews(@PathVariable Long id, @Valid @RequestBody News newsDetails) {
        return newsService.getNewsById(id)
                .map(news -> {
                    news.setTitle(newsDetails.getTitle());
                    news.setContent(newsDetails.getContent());
                    news.setImageUrl(newsDetails.getImageUrl());
                    return ResponseEntity.ok(newsService.saveNews(news));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        if (newsService.getNewsById(id).isPresent()) {
            newsService.deleteNews(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
