package com.wellnest.controller;

import com.wellnest.model.LoginRequest;
import com.wellnest.model.SignupRequest;
import com.wellnest.model.AuthResponse;
import com.wellnest.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        try {
            AuthResponse response = authService.signup(request);
            // signup returns message and expects email verification; return 200 with response
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            AuthResponse errorResponse = new AuthResponse(null, null, null, "Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        
        if (response.getToken() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        return ResponseEntity.ok(response);
    }

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

    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(@RequestParam String email) {
        AuthResponse response = authService.forgotPassword(email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(@RequestParam String email,
                                                      @RequestParam String code,
                                                      @RequestParam String newPassword) {
        AuthResponse response = authService.resetPassword(email, code, newPassword);
        if (response.getMessage() != null && response.getMessage().toLowerCase().contains("successful")) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth API is working!");
    }
}
