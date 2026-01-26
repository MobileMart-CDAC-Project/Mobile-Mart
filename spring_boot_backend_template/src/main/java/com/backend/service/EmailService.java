package com.backend.service;

public interface EmailService {
    void sendOtpEmail(String toEmail, String otp);
    void sendRegistrationSuccessEmail(String toEmail, String name);
    void sendPasswordChangeConfirmation(String toEmail, String name);
}
