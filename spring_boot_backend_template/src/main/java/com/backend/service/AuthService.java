package com.backend.service;

import com.backend.dto.AuthResponseDto;
import com.backend.dto.LoginRequestDto;
import com.backend.dto.UserDto;
import com.backend.dto.UserRegisterDto;

public interface AuthService {
	  AuthResponseDto login(LoginRequestDto dto);
	   UserDto register(UserRegisterDto dto);
	    void verifyOtp(String email, String emailOtp, String mobileOtp);
	    
	    //forgot password
	    void sendForgotPasswordOtp(String email);
		void resetPassword(String email, String otp, String newPassword);

}
