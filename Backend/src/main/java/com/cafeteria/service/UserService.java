package com.cafeteria.service;

import com.cafeteria.model.User;
import com.cafeteria.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @PostConstruct
    public void init() {
        // Create default admin user if not exists
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User("admin", "admin"); // Plain text password for simplicity as requested
            userRepository.save(admin);
            System.out.println("Default admin user created");
        }
    }
    
    public User authenticate(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(password)) {
                return user;
            }
        }
        
        return null;
    }
}
