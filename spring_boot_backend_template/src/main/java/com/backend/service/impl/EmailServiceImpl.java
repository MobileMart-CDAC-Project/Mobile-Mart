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

	@Override
	public void sendRegistrationSuccessEmail(String toEmail, String name) {
		 SimpleMailMessage msg = new SimpleMailMessage();
	        msg.setFrom("MobileMart <yourgmail@gmail.com>");
	        msg.setTo(toEmail);
	        msg.setSubject("Welcome to MobileMart 🎉");
	        msg.setText(
	            "Hi " + name + ",\n\n" +
	            "Your registration has been completed successfully.\n" +
	            "You can now log in and start shopping on MobileMart.\n\n" +
	            "Regards,\n" +
	            "MobileMart Team"
	        );
	        mailSender.send(msg);		
	}

	@Override
	public void sendPasswordChangeConfirmation(String toEmail, String name) {
		SimpleMailMessage message = new SimpleMailMessage();
		
		message.setTo(toEmail);
		message.setSubject("password changed successfully");
		
		message.setText(
		        "Hello " + name + ",\n\n" +
		                "Your password has been changed successfully.\n\n" +
		                "If you did NOT perform this action, please contact support immediately.\n\n" +
		                "Regards,\n" +
		                "Mobile Mart Team"
				);
		mailSender.send(message);
	}
}