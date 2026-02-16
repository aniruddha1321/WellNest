package com.wellnest.service; 

import org.springframework.beans.factory.annotation.Autowired; 
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage; // import mail message
import org.springframework.mail.javamail.JavaMailSender; // import mail sender
import org.springframework.stereotype.Service; 

@Service 
public class EmailService { 

    private final JavaMailSender mailSender; 

    @Value("${frontend.url:http://localhost:3000}") // inject frontend url
    private String frontendUrl; 

    @Value("${spring.mail.username:}") // inject mail from address
    private String mailFrom; 

    @Autowired 
    public EmailService(JavaMailSender mailSender) { // constructor
        this.mailSender = mailSender; // assign mail sender
    } 

    public void sendVerificationEmail(String to, String code) { // send verification email
        String subject = "WellNest - Email Verification"; // email subject
        String text = "Your WellNest verification code is: " + code + "\nThis code is valid for 15 minutes."; // email body
        sendSimpleEmail(to, subject, text); // send email
    } 

    public void sendResetEmail(String to, String code) { // send password reset email
        String subject = "WellNest - Password Reset"; // email subject
        String resetLink = frontendUrl + "/reset-password?email=" + to + "&token=" + code; // build reset link
        String text = "Click the link below to reset your password:\n\n" + resetLink +  
                      "\n\nThis link is valid for 15 minutes.\n\n" + 
                      "If you didn't request a password reset, please ignore this email.";
        sendSimpleEmail(to, subject, text); 
    } 

    private void sendSimpleEmail(String to, String subject, String text) { // send simple text email
        SimpleMailMessage message = new SimpleMailMessage(); // create message
        message.setTo(to); // set recipient
        message.setSubject(subject); // set subject
        message.setText(text); // set body text
        if (mailFrom != null && !mailFrom.isBlank()) { // check for custom from address
            message.setFrom(mailFrom); // set from address
        } 
        try { // begin send attempt
            mailSender.send(message); // send message
            System.out.println("Email sent to: " + to); 
        } catch (Exception e) { 
            System.err.println("Email failed: " + e.getMessage()); 
            throw e; 
        } 
    }
} 
