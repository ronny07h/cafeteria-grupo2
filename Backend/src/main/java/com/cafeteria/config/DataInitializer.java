package com.cafeteria.config;

import com.cafeteria.model.Category;
import com.cafeteria.model.Product;
import com.cafeteria.repository.CategoryRepository;
import com.cafeteria.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() > 0) {
            System.out.println("✅ Database already initialized. Skipping data insertion.");
            return;
        }

        // Create categories
        Category cafes = new Category("Cafés");
        Category postres = new Category("Postres");
        Category snacks = new Category("Snacks");
        
        categoryRepository.save(cafes);
        categoryRepository.save(postres);
        categoryRepository.save(snacks);
        
        // Create products - Cafés
        productRepository.save(new Product(
                "Espresso Clásico",
                "Café espresso italiano intenso y aromático, preparado con granos premium seleccionados",
                3.50,
                null,
                cafes
        ));
        
        productRepository.save(new Product(
                "Cappuccino",
                "Espresso con leche vaporizada y espuma cremosa, el equilibrio perfecto",
                4.50,
                null,
                cafes
        ));
        
        productRepository.save(new Product(
                "Latte Vainilla",
                "Café latte suave con un delicioso toque de vainilla natural",
                5.00,
                null,
                cafes
        ));
        
        productRepository.save(new Product(
                "Americano",
                "Espresso diluido con agua caliente para un sabor más suave",
                3.00,
                null,
                cafes
        ));
        
        // Create products - Postres
        productRepository.save(new Product(
                "Tarta de Chocolate",
                "Deliciosa tarta de chocolate belga con crema batida, un verdadero placer",
                6.50,
                null,
                postres
        ));
        
        productRepository.save(new Product(
                "Cheesecake",
                "Cremoso cheesecake de Nueva York con salsa de frutos rojos",
                6.00,
                null,
                postres
        ));
        
        productRepository.save(new Product(
                "Brownie",
                "Brownie de chocolate semi-amargo con nueces, servido tibio",
                4.50,
                null,
                postres
        ));
        
        productRepository.save(new Product(
                "Tiramisú",
                "Postre italiano clásico con café, mascarpone y cacao",
                6.50,
                null,
                postres
        ));
        
        // Create products - Snacks
        productRepository.save(new Product(
                "Croissant",
                "Croissant francés de mantequilla recién horneado, crujiente y dorado",
                3.00,
                null,
                snacks
        ));
        
        productRepository.save(new Product(
                "Sandwich Club",
                "Sandwich triple con pollo, bacon, lechuga, tomate y mayonesa casera",
                7.50,
                null,
                snacks
        ));
        
        productRepository.save(new Product(
                "Bagel Salmón",
                "Bagel con queso crema, salmón ahumado, alcaparras y cebolla",
                8.00,
                null,
                snacks
        ));
        
        System.out.println("✅ Database initialized with sample data!");
        System.out.println("📊 Categories: " + categoryRepository.count());
        System.out.println("🍕 Products: " + productRepository.count());
    }
}
