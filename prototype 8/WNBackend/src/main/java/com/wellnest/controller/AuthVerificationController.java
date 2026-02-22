package com.wellnest.controller;

import com.wellnest.model.AuthResponse;
import com.wellnest.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthVerificationController {

    @Autowired
    private AuthService authService;

    @RequestMapping(value = "/verify-email", method = {RequestMethod.POST, RequestMethod.GET})
    public ResponseEntity<AuthResponse> verifyEmail(@RequestParam String email, @RequestParam String code) {
        AuthResponse response = authService.verifyEmail(email, code);
        if (response.getToken() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/send-verification", method = {RequestMethod.POST, RequestMethod.GET})
    public ResponseEntity<AuthResponse> sendVerification(@RequestParam String email) {
        AuthResponse response = authService.sendVerification(email);
        if (response.getMessage() != null && response.getMessage().toLowerCase().contains("sent")) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
