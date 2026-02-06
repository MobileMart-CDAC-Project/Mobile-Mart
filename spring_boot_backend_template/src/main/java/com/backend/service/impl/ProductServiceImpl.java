package com.backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.backend.dto.AdminProductDto;
import com.backend.dto.ProductCreateDto;
import com.backend.dto.ProductDto;
import com.backend.dto.ProductUpdateDto;
import com.backend.entitys.Product;
import com.backend.entitys.User;
import com.backend.repository.OrderItemRepository;
import com.backend.repository.ProductImageRepository;
import com.backend.repository.ProductRepository;
import com.backend.repository.UserRepository;
import com.backend.security.SecurityUtil;
import com.backend.service.ProductService;

import org.springframework.lang.NonNull;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    // =================================================
    // ADMIN: ADD PRODUCT
    // =================================================
    @Override
    public ProductDto addProduct(ProductCreateDto dto) {

        User admin = userRepository.findByEmail(
                SecurityUtil.getCurrentUserEmail()
        ).orElseThrow(() -> new RuntimeException("Admin not found"));

        Product product = modelMapper.map(dto, Product.class);
        product.setAdmin(admin);
        product.setIsActive(true);
        product.setCreatedAt(LocalDateTime.now());

        Product saved = productRepository.save(product);

        return convertToPublicDto(saved);
    }

    // =================================================
    // ADMIN: GET MY PRODUCTS (WITH SALES METRICS)
    // =================================================
    @Override
    public List<ProductDto> getMyProducts() {

        User admin = userRepository.findByEmail(
                SecurityUtil.getCurrentUserEmail()
        ).orElseThrow(() -> new RuntimeException("Admin not found"));

        return productRepository.findByAdmin(admin)
                .stream()
                .map(product -> {
                    AdminProductDto adminDto = convertToAdminDto(product);
                    // Cast to ProductDto for interface compatibility
                    ProductDto dto = new ProductDto();
                    dto.setProductId(adminDto.getProductId());
                    dto.setName(adminDto.getName());
                    dto.setBrand(adminDto.getBrand());
                    dto.setDescription(adminDto.getDescription());
                    dto.setPrice(adminDto.getPrice());
                    dto.setStockQuantity(adminDto.getStockQuantity());
                    dto.setImages(adminDto.getImages());
                    // Note: totalSold and totalRevenue are not in ProductDto, 
                    // they're only for admin view via AdminProductDto
                    return dto;
                })
                .toList();
    }

    // =================================================
    // ADMIN: GET MY PRODUCTS WITH METRICS (ADMIN DTO)
    // =================================================
    @Override
    public List<AdminProductDto> getMyProductsWithMetrics() {

        User admin = userRepository.findByEmail(
                SecurityUtil.getCurrentUserEmail()
        ).orElseThrow(() -> new RuntimeException("Admin not found"));

        return productRepository.findByAdmin(admin)
                .stream()
                .map(this::convertToAdminDto)
                .toList();
    }

    // =================================================
    // ADMIN: UPDATE PRODUCT
    // =================================================
    @Override
    public ProductDto updateProduct(@NonNull Long productId, ProductUpdateDto dto) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // optional: ownership check (recommended)
        if (!product.getAdmin().getEmail()
                .equals(SecurityUtil.getCurrentUserEmail())) {
            throw new RuntimeException("You are not allowed to update this product");
        }

        product.setName(dto.getName());
        product.setBrand(dto.getBrand());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        product.setDescription(dto.getDescription());

        Product updated = productRepository.save(product);
        return convertToPublicDto(updated);
    }

    // =================================================
    // ADMIN: DELETE PRODUCT
    // =================================================
    @Override
    public void deleteProduct(@NonNull Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // ownership check
        if (!product.getAdmin().getEmail()
                .equals(SecurityUtil.getCurrentUserEmail())) {
            throw new RuntimeException("You are not allowed to delete this product");
        }

        // delete images first (DB records)
        var images = productImageRepository.findByProduct(product);
        productImageRepository.deleteAll(images);

        productRepository.delete(product);
    }

    // =================================================
    // CONVERSION METHODS
    // =================================================
    
    // For public views - NO metrics
    private ProductDto convertToPublicDto(Product product) {
        ProductDto dto = modelMapper.map(product, ProductDto.class);

        List<String> imageUrls = productImageRepository
                .findByProduct(product)
                .stream()
                .map(img -> img.getImageUrl())
                .toList();

        dto.setImages(imageUrls);
        return dto;
    }
    
    // For admin views - WITH metrics
    private AdminProductDto convertToAdminDto(Product product) {
        AdminProductDto dto = modelMapper.map(product, AdminProductDto.class);

        List<String> imageUrls = productImageRepository
                .findByProduct(product)
                .stream()
                .map(img -> img.getImageUrl())
                .toList();

        dto.setImages(imageUrls);
        
        try {
            // Get totalSold and totalRevenue from database queries
            Integer totalSold = orderItemRepository.getTotalQuantitySold(product.getProductId());
            Double totalRevenue = orderItemRepository.getTotalRevenue(product.getProductId());
            
            dto.setTotalSold(totalSold != null ? totalSold : 0);
            dto.setTotalRevenue(totalRevenue != null ? totalRevenue : 0.0);
        } catch (Exception e) {
            // Gracefully handle any errors with sales data
            dto.setTotalSold(0);
            dto.setTotalRevenue(0.0);
        }
        
        return dto;
    }
    
 // =================================================
 // USER / PUBLIC: GET ALL PRODUCTS (NO METRICS)
 // =================================================
 @Override
 public List<ProductDto> getAllProducts() {

     return productRepository.findAll()
             .stream()
             .filter(Product::getIsActive)   // optional but recommended
             .map(this::convertToPublicDto)
             .toList();
 }

 // =================================================
 // USER / PUBLIC: GET PRODUCT BY ID (NO METRICS)
 // =================================================
 @Override
 public ProductDto getProductById(@NonNull Long productId) {

     Product product = productRepository.findById(productId)
             .orElseThrow(() -> new RuntimeException("Product not found"));

     if (!product.getIsActive()) {
         throw new RuntimeException("Product is not available");
     }

     return convertToPublicDto(product);
 }

}
