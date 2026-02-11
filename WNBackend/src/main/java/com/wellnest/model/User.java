package com.wellnest.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    
    @Id
    private String id;
    
    private String fullName;
    
    @Indexed(unique = true)
    private String username;

    @Indexed(unique = true)
    private String email;
    
    private String password;
    
    private String phoneNumber;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private boolean active;
    
    // Email verification code (OTP) and expiry
    private String verificationCode;
    private java.time.LocalDateTime verificationExpiry;

    // Password reset code (OTP) and expiry
    private String resetCode;
    private java.time.LocalDateTime resetExpiry;
    
    // Profile information
    private Integer age;
    private String gender;
    private Double height; // in cm
    private Double weight; // in kg
    private List<String> goals;
    private String activityLevel;
    private List<String> recentHealthIssues;
    private List<String> pastHealthIssues;
    private Boolean profileCompleted;
    
    public User(String fullName, String email, String password) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.active = true;
        this.profileCompleted = false;
    }
}
