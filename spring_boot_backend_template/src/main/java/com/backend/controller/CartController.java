package com.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.AddToCartDto;
import com.backend.dto.CartDto;
import com.backend.service.CartService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

//@RestController
//@RequestMapping("/api/cart")
//@RequiredArgsConstructor
//public class CartController {
//
//    private final CartService cartService;
//
//    @PostMapping("/add/{productId}")
//    public ResponseEntity<CartDto> addToCart(
//            @PathVariable Long productId,
//            @RequestParam int quantity) {
//        return ResponseEntity.ok(cartService.addToCart(productId, quantity));
//    }
//
//    @PutMapping("/update/{itemId}")
//    public ResponseEntity<CartDto> updateQuantity(
//            @PathVariable Long itemId,
//            @RequestParam int quantity) {
//        return ResponseEntity.ok(cartService.updateQuantity(itemId, quantity));
//    }
//
//    @GetMapping
//    public ResponseEntity<CartDto> viewCart() {
//        return ResponseEntity.ok(cartService.viewCart());
//    }
//
//    @DeleteMapping("/remove/{itemId}")
//    public ResponseEntity<Void> removeItem(
//            @PathVariable Long itemId) {
//        cartService.removeItem(itemId);
//        return ResponseEntity.noContent().build();
//    }
//
//    @DeleteMapping("/clear")
//    public ResponseEntity<Void> clearCart() {
//        cartService.clearCart();
//        return ResponseEntity.noContent().build();
//    }
//}

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<CartDto> addToCart(
            @Valid @RequestBody AddToCartDto dto) {

        return ResponseEntity.ok(cartService.addToCart(dto));
    }

    @GetMapping
    public ResponseEntity<CartDto> viewCart() {
        return ResponseEntity.ok(cartService.viewCart());
    }

    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCart() {

        cartService.clearCart();
        return ResponseEntity.ok("Cart cleared successfully");
    }
    @PutMapping("/update")
    public ResponseEntity<CartDto> updateCart(@RequestBody AddToCartDto dto) {
        return ResponseEntity.ok(cartService.updateCart(dto));
    }
}

