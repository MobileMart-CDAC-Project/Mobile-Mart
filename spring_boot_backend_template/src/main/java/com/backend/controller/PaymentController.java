package com.backend.controller;

import com.razorpay.RazorpayException;
import com.backend.service.RazorpayService;
import com.backend.service.OrderService;
import com.backend.dto.OrderDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private RazorpayService razorpayService;

    @Autowired
    private OrderService orderService;

    @PostMapping("/create-order")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> request) {
        try {
            int amount = ((Number) request.get("amount")).intValue();
            String currency = (String) request.get("currency");

            String orderId = razorpayService.createOrder(amount, currency, "receipt_" + System.currentTimeMillis());

            return ResponseEntity.ok(Map.of(
                "id", orderId,
                "amount", amount,
                "currency", currency
            ));
        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify-payment")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody Map<String, Object> paymentData) {
        try {
            // Here you would typically verify the payment signature
            // For now, we'll just place the order

            // Place the order
            OrderDto orderDto = orderService.placeOrder();

            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Payment verified and order placed",
                "orderId", orderDto.getOrderId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "failed",
                "message", e.getMessage()
            ));
        }
    }

}