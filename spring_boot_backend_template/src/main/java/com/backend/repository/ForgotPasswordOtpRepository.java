package com.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entitys.ForgotPasswordOtp;

public interface ForgotPasswordOtpRepository extends JpaRepository<ForgotPasswordOtp, Long> {
	Optional<ForgotPasswordOtp> findByEmailAndOtpAndVerifiedFalse(
            String email, String otp);
}
