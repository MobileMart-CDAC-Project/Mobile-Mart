package com.backend.service.impl;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.dto.AddToCartDto;
import com.backend.dto.CartDto;
import com.backend.dto.CartItemDto;
import com.backend.entitys.Cart;
import com.backend.entitys.CartItem;
import com.backend.entitys.Product;
import com.backend.entitys.User;
import com.backend.repository.CartItemRepository;
import com.backend.repository.CartRepository;
import com.backend.repository.ProductRepository;
import com.backend.repository.UserRepository;
import com.backend.service.CartService;
import com.backend.service.SecurityUtil;

import lombok.*;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public CartDto addToCart(AddToCartDto dto) {

        User user = userRepository.findByEmail(
                SecurityUtil.getCurrentUserEmail()
        ).orElseThrow();

//        Cart cart = cartRepository.findByUser(user)
//                .orElseGet(() ->
//                        cartRepository.save(
//                                new Cart(null, user, "ACTIVE", LocalDateTime.now())
//                        ));
        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    newCart.setStatus("ACTIVE");
                    newCart.setCreatedAt(LocalDateTime.now());
                    return cartRepository.save(newCart);
                });


        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow();

        CartItem cartItem = cartItemRepository
                .findByCartAndProduct(cart, product)
                .orElse(new CartItem(null, cart, product, 0));

        cartItem.setQuantity(cartItem.getQuantity() + dto.getQuantity());
        cartItemRepository.save(cartItem);

        return viewCart();
    }

    @Override
    public CartDto viewCart() {

        User user = userRepository.findByEmail(
                SecurityUtil.getCurrentUserEmail()
        ).orElseThrow();

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItemDto> items = cartItemRepository.findByCart(cart)
                .stream()
                .map(ci -> new CartItemDto(
                        ci.getCartItemId(),
                        ci.getProduct().getProductId(),
                        ci.getProduct().getName(),
                        ci.getQuantity(),
                        ci.getProduct().getPrice()
                ))
                .toList();

        double total = items.stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();

        return new CartDto(items, total);
    }

    @Override
    public void clearCart() {

        User user = userRepository.findByEmail(
                SecurityUtil.getCurrentUserEmail()
        ).orElseThrow();

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow();

        cartItemRepository.deleteByCart(cart);
        cart.setStatus("CONVERTED");
        cartRepository.save(cart);
    }
    
    @Override
    @Transactional   // 🔥 REQUIRED
    public CartDto updateCart(AddToCartDto dto) {

        User user = userRepository.findByEmail(
                SecurityUtil.getCurrentUserEmail()
        ).orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = cartItemRepository
                .findByCartAndProduct(cart, product)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (dto.getQuantity() <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(dto.getQuantity());
            cartItemRepository.save(cartItem);
        }

        return viewCart(); // recalc total
    }

    
}
