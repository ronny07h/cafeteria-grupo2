package com.cafeteria.controller;

import com.cafeteria.model.CompanyConfig;
import com.cafeteria.service.CompanyConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
    public CompanyConfig updateConfig(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        return service.updateCompanyConfig(name);
    }
}
