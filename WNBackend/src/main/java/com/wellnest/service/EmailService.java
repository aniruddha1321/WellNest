package com.wellnest.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${spring.mail.username:}")
    private String mailFrom;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String to, String code) {
        String subject = "WellNest - Email Verification";
        String text = "Your WellNest verification code is: " + code + "\nThis code is valid for 15 minutes.";
        sendSimpleEmail(to, subject, text);
    }

    public void sendResetEmail(String to, String code) {
        String subject = "WellNest - Password Reset";
        String resetLink = frontendUrl + "/reset-password?email=" + to + "&token=" + code;
        String text = "Click the link below to reset your password:\n\n" + resetLink + 
                      "\n\nThis link is valid for 15 minutes.\n\n" +
                      "If you didn't request a password reset, please ignore this email.";
        sendSimpleEmail(to, subject, text);
    }

    private void sendSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        if (mailFrom != null && !mailFrom.isBlank()) {
            message.setFrom(mailFrom);
        }
        try {
            mailSender.send(message);
            System.out.println("Email sent to: " + to);
        } catch (Exception e) {
            System.err.println("Email failed: " + e.getMessage());
            throw e;
        }
    }
}
