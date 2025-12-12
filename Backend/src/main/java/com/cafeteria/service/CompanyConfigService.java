package com.cafeteria.service;

import com.cafeteria.model.CompanyConfig;
import com.cafeteria.repository.CompanyConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyConfigService {

    @Autowired
    private CompanyConfigRepository repository;

    public CompanyConfig getCompanyConfig() {
        List<CompanyConfig> configs = repository.findAll();
        if (configs.isEmpty()) {
            CompanyConfig defaultConfig = new CompanyConfig("Café Aroma");
            return repository.save(defaultConfig);
        }
        return configs.get(0);
    }

    public CompanyConfig updateCompanyConfig(String name) {
        CompanyConfig config = getCompanyConfig();
        config.setName(name);
        return repository.save(config);
    }
}
