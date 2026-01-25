package com.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.AuthResponseDto;
import com.backend.dto.LoginRequestDto;
import com.backend.dto.UserDto;
import com.backend.dto.UserRegisterDto;
import com.backend.service.AuthService;

import org.springframework.web.bind.annotation.RequestBody;

import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import java.util.Map;


//@RestController
//@RequestMapping("/api/auth")
//@RequiredArgsConstructor
//public class AuthController {
//
//    private final AuthService authService;
//
//    @PostMapping("/login")
//    public ResponseEntity<AuthResponseDto> login(
//          @Valid @RequestBody LoginRequestDto dto) {
//        return ResponseEntity.ok(authService.login(dto));
//    }
//
//    @PostMapping("/register")
//    public ResponseEntity<UserDto> register(
//          @Valid  @RequestBody UserRegisterDto dto) {
//        return ResponseEntity.ok(authService.register(dto));
//    }
//}

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    @PostConstruct
//    public void printAdminPasswords() {
//        System.out.println("admin123 = " + passwordEncoder.encode("admin123"));
//        System.out.println("admin456 = " + passwordEncoder.encode("admin456"));
//        System.out.println("admin789 = " + passwordEncoder.encode("admin789"));
//    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(
            @Valid @RequestBody UserRegisterDto dto) {

        return ResponseEntity.ok(authService.register(dto));
    }

   
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(
            @Valid @RequestBody LoginRequestDto dto) {
    	System.out.print(dto.getEmail());

        return ResponseEntity.ok(authService.login(dto));
    }
    
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> req) {

        authService.verifyOtp(
            req.get("email"),
            req.get("emailOtp"),
            req.get("mobileOtp")
        );

        return ResponseEntity.ok("OTP verified. Registration completed.");
    }

}

