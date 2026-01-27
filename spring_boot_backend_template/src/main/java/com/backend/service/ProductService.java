package com.backend.service;

import org.springframework.lang.NonNull;

import java.util.List;

import com.backend.dto.AdminProductDto;
import com.backend.dto.ProductCreateDto;
import com.backend.dto.ProductDto;
import com.backend.dto.ProductUpdateDto;

public interface ProductService {
		//ProductDto addProduct(ProductCreateDto dto);
//	    ProductDto updateProduct(Long productId, ProductUpdateDto dto);
//	    void deleteProduct(Long productId);
//	    List<ProductDto> getMyProducts();
//
//	    List<ProductDto> getAllProducts();
//	    ProductDto getProductById(Long id);
//	    List<ProductDto> searchProduct(String name);
//	    List<ProductDto> getByCategory(String category);
		
	
	 // public / user
    List<ProductDto> getAllProducts();
    ProductDto getProductById(@NonNull Long productId);

    // admin
    ProductDto addProduct(ProductCreateDto dto);
    List<ProductDto> getMyProducts();
    List<AdminProductDto> getMyProductsWithMetrics();
    ProductDto updateProduct(@NonNull Long productId, ProductUpdateDto dto);
    void deleteProduct(@NonNull Long productId);
		   
		

}
