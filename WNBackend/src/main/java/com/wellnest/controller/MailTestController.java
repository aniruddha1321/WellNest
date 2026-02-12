package com.wellnest.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wellnest.service.EmailService;
@RestController
@RequestMapping("/test")
public class MailTestController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/mail")
    public String testMail() {
        emailService.sendVerificationEmail(
            "vallabh.punekara77@gmail.com", 
            "999999"
        );
        return "Mail Triggered";
    }
}
