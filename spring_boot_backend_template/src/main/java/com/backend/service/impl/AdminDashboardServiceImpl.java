//
//package com.backend.service.impl;
//import java.util.List;
//
//import org.springframework.stereotype.Service;
//
//import com.backend.dto.DashboardStatsDto;
//import com.backend.dto.OrderDto;
//import com.backend.entitys.Order;
//import com.backend.entitys.OrderStatus;
//import com.backend.repository.OrderRepository;
//import com.backend.repository.UserRepository;
//import com.backend.service.AdminDashboardService;
//
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//public class AdminDashboardServiceImpl implements AdminDashboardService {
//
//    private final UserRepository userRepository;
//    private final OrderRepository orderRepository;
//
//    @Override
//    public DashboardStatsDto getStats() {
//        return new DashboardStatsDto(
//                userRepository.count(),
//                orderRepository.count()
//        );
//    }
//
//    @Override
//    public List<OrderDto> getAllOrders() {
//        return orderRepository.findAll()
//                .stream()
//                .map(o -> new OrderDto(
//                        o.getOrderId(),
//                        o.getOrderStatus().name(),
//                        o.getTotalAmount()
//                ))
//                .toList();
//    }
//
//    @Override
//    public void updateOrderStatus(Long orderId, String status) {
//        Order order = orderRepository.findById(orderId)
//                .orElseThrow(() -> new RuntimeException("Order not found"));
//
//        order.setOrderStatus(OrderStatus.valueOf(status));
//        orderRepository.save(order);
//    }
//}
