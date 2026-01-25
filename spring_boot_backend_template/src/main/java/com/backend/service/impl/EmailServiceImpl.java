package com.backend.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.backend.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

	@Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendOtpEmail(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("MobileMart <fullstack4project@gmail.com>");
        message.setTo(toEmail);
        message.setSubject("MobileMart - OTP Verification");
        message.setText(
        	"Welcome User, \n"+
            "Your OTP is: " + otp +
            "\n\nThis OTP is valid for 5 minutes."
        );

        mailSender.send(message);
    }
}