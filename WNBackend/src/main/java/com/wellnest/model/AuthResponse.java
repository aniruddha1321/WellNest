package com.wellnest.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String fullName;
    private String message;
    
    public AuthResponse(String token, String email, String fullName) {
        this.token = token;
        this.email = email;
        this.fullName = fullName;
    }
}
