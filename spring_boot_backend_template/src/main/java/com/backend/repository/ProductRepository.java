package com.backend.repository;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entitys.Product;
import com.backend.entitys.User;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByAdmin(User admin);

//    List<Product> findByNameContainingIgnoreCase(String name);
//
//    List<Product> findByCategory(String category);
    
    List<Product> findByAdmin_UserId(Long userId);
}
