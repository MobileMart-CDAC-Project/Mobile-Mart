package com.backend.service;

import com.backend.dto.AddToCartDto;
import com.backend.dto.CartDto;

//public interface CartService {
//		CartDto addToCart(Long productId, int quantity);
//	    CartDto updateQuantity(Long itemId, int quantity);
//	    CartDto viewCart();
//	    void removeItem(Long itemId);
//	    void clearCart();
//}
public interface CartService {

    CartDto addToCart(AddToCartDto dto);

    CartDto viewCart();

    void clearCart();

	CartDto updateCart(AddToCartDto dto);
}

