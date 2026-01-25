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
import java.util.Optional;

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
import com.backend.util.OtpUtil;

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
//        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
//            throw new RuntimeException("Email already registered");
//        }
    	// to make user use same email if tried registering , but otp verification failed !
    	Optional<User> existingUserOpt = userRepository.findByEmail(dto.getEmail());

    	if (existingUserOpt.isPresent()) {
    	    User existingUser = existingUserOpt.get();

    	    // Case 1: already verified user → block
    	    if (existingUser.getActive()) {
    	        throw new RuntimeException("Email already registered");
    	    }

    	    // Case 2: user exists but NOT verified → resend OTP
    	    existingUser.setEmailOtp(OtpUtil.generateOtp());
    	    existingUser.setMobileOtp(OtpUtil.generateOtp());
    	    existingUser.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

    	    userRepository.save(existingUser);

    	    // 🔴 TEMP: log OTPs (for testing)
    	    System.out.println("Resent Email OTP: " + existingUser.getEmailOtp());
    	    System.out.println("Resent Mobile OTP: " + existingUser.getMobileOtp());

    	    // return existing user info (no new user created)
    	    UserDto userDto = new UserDto();
    	    userDto.setUserId(existingUser.getUserId());
    	    userDto.setName(existingUser.getName());
    	    userDto.setEmail(existingUser.getEmail());
    	    userDto.setRole(existingUser.getRole().name());

    	    return userDto;
    	}


        // 2. Create User entity
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setMobile(dto.getMobile());
        user.setRole(Role.USER); // default role
        user.setCreatedAt(LocalDateTime.now());
       
        //setted false to first verify otp
        user.setActive(false); // not active yet
        user.setEmailVerified(false);
        user.setMobileVerified(false);
        
        //otp verification
        user.setEmailOtp(OtpUtil.generateOtp());
        user.setMobileOtp(OtpUtil.generateOtp());
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        
        User savedUser = userRepository.save(user);


        // 🔴 TEMP: log OTPs (for testing)
        System.out.println("Email OTP: " + savedUser.getEmailOtp());
        System.out.println("Mobile OTP: " + savedUser.getMobileOtp());
        
        
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

     // 2.5 OTP VERIFICATION CHECK (ADD HERE)
        
        if (!user.getActive()) {
            throw new RuntimeException("Please verify OTP to activate account");
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

    // verify otp
	@Override
	public void verifyOtp(String email, String emailOtp, String mobileOtp) {
		User user = userRepository.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    if (user.getOtpExpiry() == null ||
	        user.getOtpExpiry().isBefore(LocalDateTime.now())) {
	        throw new RuntimeException("OTP expired");
	    }

	    if (!user.getEmailOtp().equals(emailOtp) ||
	        !user.getMobileOtp().equals(mobileOtp)) {
	        throw new RuntimeException("Invalid OTP");
	    }

	    user.setEmailVerified(true);
	    user.setMobileVerified(true);
	    user.setActive(true);

	    user.setEmailOtp(null);
	    user.setMobileOtp(null);
	    user.setOtpExpiry(null);

	    userRepository.save(user);		
	}
}
