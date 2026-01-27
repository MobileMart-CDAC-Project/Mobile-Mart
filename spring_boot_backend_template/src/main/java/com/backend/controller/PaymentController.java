package com.backend.controller;


import com.razorpay.RazorpayException;
//import org.example.springbootpaymentgatewayrazorpay.service.RazorpayService;
import com.backend.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.json.JSONObject;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private RazorpayService razorpayService;

    @PostMapping("/create-order")
    public ResponseEntity<Object> createOrder(@RequestParam int amount , @RequestParam String currency){

        try {
            String orderJson = razorpayService.createOrder(amount, currency, "recepient_100");
            // Parse the string to return as proper JSON object
            JSONObject orderObj = new JSONObject(orderJson);
            return ResponseEntity.ok(orderObj.toMap());
        } catch (RazorpayException e) {
            throw new RuntimeException(e);
        }
    }

}