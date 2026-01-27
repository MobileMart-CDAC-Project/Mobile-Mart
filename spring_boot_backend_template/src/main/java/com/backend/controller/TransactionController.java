package com.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.TransactionDto;
import com.backend.service.TransactionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/pay/{orderId}")
    public ResponseEntity<TransactionDto> pay(
            @PathVariable Long orderId) {
        return ResponseEntity.ok(transactionService.pay(orderId));
    }

    @GetMapping("/status/{orderId}")
    public ResponseEntity<TransactionDto> status(
            @PathVariable Long orderId) {
        return ResponseEntity.ok(transactionService.status(orderId));
    }
}

