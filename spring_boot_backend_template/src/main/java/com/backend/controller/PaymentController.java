package com.backend.controller;


import com.razorpay.RazorpayException;
//import org.example.springbootpaymentgatewayrazorpay.service.RazorpayService;
import com.backend.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private RazorpayService razorpayService;

    @PostMapping("/create-order")
    public String createOrder(@RequestParam int amount , @RequestParam String currency){

        try {
            return razorpayService.createOrder(amount, currency, "recepient_100");
        } catch (RazorpayException e) {
            throw new RuntimeException(e);
        }
    }

}