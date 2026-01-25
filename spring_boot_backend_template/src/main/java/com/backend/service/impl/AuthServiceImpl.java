//package com.backend.service.impl;
//import org.modelmapper.ModelMapper;
//import org.springframework.stereotype.Service;
//
//import com.backend.dto.AuthResponseDto;
//import com.backend.dto.LoginRequestDto;
//import com.backend.dto.UserDto;
//import com.backend.dto.UserRegisterDto;
//import com.backend.entitys.Role;
//import com.backend.entitys.User;
//import com.backend.repository.UserRepository;
//import com.backend.service.AuthService;
//
//import lombok.RequiredArgsConstructor;


package com.backend.service.impl;

import java.time.LocalDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.backend.dto.AuthResponseDto;
import com.backend.dto.LoginRequestDto;
import com.backend.dto.UserDto;
import com.backend.dto.UserRegisterDto;
import com.backend.entitys.Role;
import com.backend.entitys.User;
import com.backend.repository.UserRepository;
import com.backend.security.JwtUtil;
import com.backend.service.AuthService;

import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//public class AuthServiceImpl implements AuthService {
//
//    private final AuthenticationManager authenticationManager;
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final JwtUtil jwtUtil;
//
//    @Override
//    public AuthResponseDto login(LoginRequestDto dto) {
//
//        Authentication auth = authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(
//                        dto.getEmail(), dto.getPassword())
//        );
//
//        String token = jwtUtil.generateToken(auth.getName());
//
//        User user = userRepository.findByEmail(dto.getEmail()).orElseThrow();
//
//        return new AuthResponseDto(token, user.getRole().name());
//    }
//
//    @Override
//    public AuthResponseDto register(UserRegisterDto dto) {
//
//        if (userRepository.existsByEmail(dto.getEmail())) {
//            throw new RuntimeException("Email already registered");
//        }
//
//        User user = new User();
//        user.setName(dto.getName());
//        user.setEmail(dto.getEmail());
//        user.setPassword(passwordEncoder.encode(dto.getPassword()));
//        user.setMobile(dto.getMobile());
//        user.setRole(Role.USER); // fixed role for registration
//
//        userRepository.save(user);
//
//        String token = jwtUtil.generateToken(user.getEmail());
//
//        return new AuthResponseDto(token, user.getRole().name());
//    }
//}

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public UserDto register(UserRegisterDto dto) {

        // 1. Check email already exists
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // 2. Create User entity
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setMobile(dto.getMobile());
        user.setRole(Role.USER); // default role
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // 3. Convert to UserDto
        UserDto userDto = new UserDto();
        userDto.setUserId(savedUser.getUserId());
        userDto.setName(savedUser.getName());
        userDto.setEmail(savedUser.getEmail());
        userDto.setRole(savedUser.getRole().name());

        return userDto;
    }

    @Override
    public AuthResponseDto login(LoginRequestDto dto) {

        // 1. Find user by email
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // 2. Validate password
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // 3. Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        // 4. Prepare response
        AuthResponseDto response = new AuthResponseDto();
        response.setToken(token);
        response.setUserId(user.getUserId());
        response.setRole(user.getRole().name());

        return response;
    }
}
