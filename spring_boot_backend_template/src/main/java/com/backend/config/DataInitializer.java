package com.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.backend.entitys.Role;
import com.backend.entitys.User;
import com.backend.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if admin user already exists
            if (!userRepository.existsByEmail("admin@admin.com")) {
                User adminUser = new User();
                adminUser.setName("Admin");
                adminUser.setEmail("admin@admin.com");
                adminUser.setPassword(passwordEncoder.encode("1234"));
                adminUser.setRole(Role.ADMIN);
                adminUser.setActive(true);
                adminUser.setEmailVerified(true);
                adminUser.setMobileVerified(false);
                
                userRepository.save(adminUser);
                System.out.println("✅ Admin user created: admin@admin.com");
            } else {
                System.out.println("⚠️  Admin user already exists");
            }
        };
    }
}
