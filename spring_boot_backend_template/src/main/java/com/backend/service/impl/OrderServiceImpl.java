
package com.backend.service.impl;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.dto.OrderDetailsDto;
import com.backend.dto.OrderDto;
import com.backend.dto.OrderItemDto;
import com.backend.entitys.Cart;
import com.backend.entitys.CartItem;
import com.backend.entitys.Order;
import com.backend.entitys.OrderItem;
import com.backend.entitys.OrderStatus;
import com.backend.entitys.User;
import com.backend.repository.CartItemRepository;
import com.backend.repository.CartRepository;
import com.backend.repository.OrderItemRepository;
import com.backend.repository.OrderRepository;
import com.backend.repository.UserRepository;
import com.backend.service.OrderService;
import com.backend.service.SecurityUtil;

import org.springframework.lang.NonNull;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public OrderDto placeOrder() {

        User user = userRepository.findByEmail(
                SecurityUtil.getCurrentUserEmail()
        ).orElseThrow();

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> cartItems = cartItemRepository.findByCart(cart);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // 1. Create Order
        Order order = new Order();
        order.setUser(user);
        order.setOrderStatus(OrderStatus.PLACED);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(0.0);

        Order savedOrder = orderRepository.save(order);

        double total = 0;

        // 2. Create OrderItems
        for (CartItem ci : cartItems) {

            OrderItem oi = new OrderItem();
            oi.setOrder(savedOrder);
            oi.setProduct(ci.getProduct());
            oi.setPrice(ci.getProduct().getPrice()); // snapshot
            oi.setQuantity(ci.getQuantity());

            total += oi.getPrice() * oi.getQuantity();
            orderItemRepository.save(oi);
        }

        // 3. Update total
        savedOrder.setTotalAmount(total);
        orderRepository.save(savedOrder);

        // 4. Cart will be cleared only after successful payment verification

        OrderDto dto = new OrderDto();
        dto.setOrderId(savedOrder.getOrderId());
        dto.setTotalAmount(savedOrder.getTotalAmount());
        dto.setStatus(savedOrder.getOrderStatus().name());
        return dto;

    }

    @Override
    public List<OrderDto> myOrders() {

        User user = userRepository.findByEmail(
                SecurityUtil.getCurrentUserEmail()
        ).orElseThrow();

        return orderRepository.findByUser(user)
                .stream()
                .map(order -> {
                    OrderDto dto = new OrderDto();
                    dto.setOrderId(order.getOrderId());
                    dto.setTotalAmount(order.getTotalAmount());
                    dto.setStatus(order.getOrderStatus().name());
                    return dto;
                })
                .toList();
    }

//    @Override
//    public OrderDto orderDetails(Long orderId) {
//
//        Order order = orderRepository.findById(orderId)
//                .orElseThrow(() -> new RuntimeException("Order not found"));
//
//        OrderDto dto = new OrderDto();
//        dto.setOrderId(order.getOrderId());
//        dto.setTotalAmount(order.getTotalAmount());
//        dto.setStatus(order.getOrderStatus().name());
//
//        return dto;
//    }
    
    @Override
    public OrderDetailsDto orderDetails(@NonNull Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        List<OrderItem> orderItems =
                orderItemRepository.findByOrder(order);

        List<OrderItemDto> itemDtos = orderItems.stream()
                .map(oi -> {
                    OrderItemDto dto = new OrderItemDto();
                    dto.setProductId(oi.getProduct().getProductId());
                    dto.setProductName(oi.getProduct().getName());
                    dto.setPrice(oi.getPrice());
                    dto.setQuantity(oi.getQuantity());
                    return dto;
                })
                .toList();

        OrderDetailsDto detailsDto = new OrderDetailsDto();
        detailsDto.setOrderId(order.getOrderId());
        detailsDto.setTotalAmount(order.getTotalAmount());
        detailsDto.setStatus(order.getOrderStatus().name());
        detailsDto.setItems(itemDtos);

        return detailsDto;
    }
    
    @Override
    public List<OrderDto> getAllOrders() {

        return orderRepository.findAll()
                .stream()
                .map(order -> {
                    OrderDto dto = new OrderDto();
                    dto.setOrderId(order.getOrderId());
                    dto.setTotalAmount(order.getTotalAmount());
                    dto.setStatus(order.getOrderStatus().name());
                    return dto;
                })
                .toList();
    }

    @Override
    @Transactional
    public void clearCartForOrder(@NonNull Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        User user = order.getUser();
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cartItemRepository.deleteByCart(cart);
    }
    
    @Override
    public OrderDetailsDto getOrderDetailsForAdmin(@NonNull Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        List<OrderItem> orderItems =
                orderItemRepository.findByOrder(order);

        List<OrderItemDto> itemDtos = orderItems.stream()
                .map(oi -> {
                    OrderItemDto dto = new OrderItemDto();
                    dto.setProductId(oi.getProduct().getProductId());
                    dto.setProductName(oi.getProduct().getName());
                    dto.setPrice(oi.getPrice());
                    dto.setQuantity(oi.getQuantity());
                    return dto;
                })
                .toList();

        OrderDetailsDto detailsDto = new OrderDetailsDto();
        detailsDto.setOrderId(order.getOrderId());
        detailsDto.setTotalAmount(order.getTotalAmount());
        detailsDto.setStatus(order.getOrderStatus().name());
        detailsDto.setItems(itemDtos);

        return detailsDto;
    }



}
