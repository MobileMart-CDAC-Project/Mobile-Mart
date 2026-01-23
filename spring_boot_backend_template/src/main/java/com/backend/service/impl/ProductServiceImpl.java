package com.backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.backend.dto.ProductCreateDto;
import com.backend.dto.ProductDto;
import com.backend.dto.ProductUpdateDto;
import com.backend.entitys.Product;
import com.backend.entitys.User;
import com.backend.repository.ProductImageRepository;
import com.backend.repository.ProductRepository;
import com.backend.repository.UserRepository;
import com.backend.security.SecurityUtil;
import com.backend.service.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
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

        return convertToDtoWithImages(saved);
    }

    // =================================================
    // ADMIN: GET MY PRODUCTS
    // =================================================
    @Override
    public List<ProductDto> getMyProducts() {

        User admin = userRepository.findByEmail(
                SecurityUtil.getCurrentUserEmail()
        ).orElseThrow(() -> new RuntimeException("Admin not found"));

        return productRepository.findByAdmin(admin)
                .stream()
                .map(this::convertToDtoWithImages)
                .toList();
    }

    // =================================================
    // ADMIN: UPDATE PRODUCT
    // =================================================
    @Override
    public ProductDto updateProduct(Long productId, ProductUpdateDto dto) {

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
        product.setIsActive(dto.getIsActive());

        Product updated = productRepository.save(product);
        return convertToDtoWithImages(updated);
    }

    // =================================================
    // ADMIN: DELETE PRODUCT
    // =================================================
    @Override
    public void deleteProduct(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // ownership check
        if (!product.getAdmin().getEmail()
                .equals(SecurityUtil.getCurrentUserEmail())) {
            throw new RuntimeException("You are not allowed to delete this product");
        }

        // delete images first (DB records)
        productImageRepository.deleteAll(
                productImageRepository.findByProduct(product)
        );

        productRepository.delete(product);
    }

    // =================================================
    // COMMON METHOD (ALREADY CONFIRMED)
    // =================================================
    private ProductDto convertToDtoWithImages(Product product) {

        ProductDto dto = modelMapper.map(product, ProductDto.class);

        List<String> imageUrls = productImageRepository
                .findByProduct(product)
                .stream()
                .map(img -> img.getImageUrl())
                .toList();

        dto.setImages(imageUrls);
        return dto;
    }
    
 // =================================================
 // USER / PUBLIC: GET ALL PRODUCTS
 // =================================================
 @Override
 public List<ProductDto> getAllProducts() {

     return productRepository.findAll()
             .stream()
             .filter(Product::getIsActive)   // optional but recommended
             .map(this::convertToDtoWithImages)
             .toList();
 }

 // =================================================
 // USER / PUBLIC: GET PRODUCT BY ID
 // =================================================
 @Override
 public ProductDto getProductById(Long productId) {

     Product product = productRepository.findById(productId)
             .orElseThrow(() -> new RuntimeException("Product not found"));

     if (!product.getIsActive()) {
         throw new RuntimeException("Product is not available");
     }

     return convertToDtoWithImages(product);
 }

}
