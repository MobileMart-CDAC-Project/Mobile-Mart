package com.backend.entitys;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name= "forgot_password_otp")
public class ForgotPasswordOtp {
	

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column( nullable=false)
    private String email;
    @Column( nullable=false)
    private String otp;
    @Column( nullable=false)
    private LocalDateTime expiryTime;
    private boolean verified = false;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable=false)
    private User user;
}
