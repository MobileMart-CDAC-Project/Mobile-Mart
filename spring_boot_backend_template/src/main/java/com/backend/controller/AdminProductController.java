package com.backend.controller;

import org.springframework.lang.NonNull;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.backend.dto.ProductCreateDto;
import com.backend.dto.ProductDto;
import com.backend.dto.ProductUpdateDto;
import com.backend.dto.DashboardStatsDto;
import com.backend.service.ProductService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final ProductService productService;

    // ===============================
    // GET DASHBOARD STATS
    // ===============================
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto(
                (long) productService.getMyProducts().size(),  // totalProducts
                0L,  // totalSold (will be calculated from orders)
                0.0  // revenue (will be calculated from orders)
        );
        return ResponseEntity.ok(stats);
    }

    // ===============================
    // ADD PRODUCT (ADMIN)
    // ===============================
    @PostMapping("/products")
    public ResponseEntity<ProductDto> addProduct(
            @Valid @RequestBody ProductCreateDto dto) {

        return ResponseEntity.ok(productService.addProduct(dto));
    }

    // ===============================
    // GET MY PRODUCTS (ADMIN)
    // ===============================
    @GetMapping("/products")
    public ResponseEntity<List<ProductDto>> myProducts() {

        return ResponseEntity.ok(productService.getMyProducts());
    }

    // ===============================
    // UPDATE PRODUCT (ADMIN)
    // ===============================
    @PutMapping("/products/{productId}")
    public ResponseEntity<ProductDto> updateProduct(
            @PathVariable @NonNull Long productId,
            @Valid @RequestBody ProductUpdateDto dto) {

        return ResponseEntity.ok(
                productService.updateProduct(productId, dto)
        );
    }

    // ===============================
    // DELETE PRODUCT (ADMIN)
    // ===============================
    @DeleteMapping("/products/{productId}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable @NonNull Long productId) {

        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }
}





