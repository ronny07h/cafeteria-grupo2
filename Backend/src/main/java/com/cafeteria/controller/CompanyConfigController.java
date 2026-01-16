package com.cafeteria.controller;

import com.cafeteria.model.CompanyConfig;
import com.cafeteria.service.CompanyConfigService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;




@RestController
@RequestMapping("/api/config")
@CrossOrigin(origins = "*")
public class CompanyConfigController {

    @Autowired
    private CompanyConfigService service;

    @GetMapping
    public CompanyConfig getConfig() {
        return service.getCompanyConfig();
    }

    @PutMapping
    public ResponseEntity<CompanyConfig> updateCompanyConfig(@Valid @RequestBody CompanyConfig config) {
        return ResponseEntity.ok(service.updateCompanyConfig(config));
    }
}
