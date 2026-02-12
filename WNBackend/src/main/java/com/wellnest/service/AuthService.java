package com.wellnest.service;

import com.wellnest.model.User;
import com.wellnest.model.LoginRequest;
import com.wellnest.model.SignupRequest;
import com.wellnest.model.AuthResponse;
import com.wellnest.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.mongodb.MongoWriteException;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    public AuthResponse signup(SignupRequest request) {
        System.out.println("SIGNUP API HIT");

        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(null, null, null, "Email already registered");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            return new AuthResponse(null, null, null, "Username already taken");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setActive(false); // require email verification

        // will require explicit verification via sendVerification endpoint

        try {
            userRepository.save(user);
        } catch (MongoWriteException e) {
            if (e.getError().getCategory().name().equals("DUPLICATE_KEY")) {
                return new AuthResponse(null, null, null, "Email or username already registered");
            }
            throw e;
        }
        String otp = generateOtp();
        user.setVerificationCode(otp);
        user.setVerificationExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), otp);
        return new AuthResponse(null, user.getEmail(), user.getFullName(), "Signup successful. Please verify your email to activate your account.");
    }

    public AuthResponse sendVerification(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return new AuthResponse(null, null, null, "No account found for this email");
        }

        User user = userOptional.get();
        String otp = generateOtp();
        user.setVerificationCode(otp);
        user.setVerificationExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        try {
            emailService.sendVerificationEmail(user.getEmail(), otp);
        } catch (Exception ex) {
            ex.printStackTrace();
            return new AuthResponse(null, null, null, "Failed to send verification email");
        }

        return new AuthResponse(null, user.getEmail(), user.getFullName(), "Verification code sent to email");
    }

    public AuthResponse login(LoginRequest request) {

        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());

        if (userOptional.isEmpty()) {
            return new AuthResponse(null, null, null, "Invalid username or password");
        }

        User user = userOptional.get();

        if (!user.isActive()) {
            return new AuthResponse(null, null, null, "Account is not verified. Please verify your email.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse(null, null, null, "Invalid username or password");
        }

        String token = jwtService.generateToken(user.getUsername());

        return new AuthResponse(token, user.getEmail(), user.getFullName(), "Login successful");
    }

    public AuthResponse verifyEmail(String email, String code) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return new AuthResponse(null, null, null, "Invalid email or code");
        }

        User user = userOptional.get();
        if (user.getVerificationCode() == null || user.getVerificationExpiry() == null) {
            return new AuthResponse(null, null, null, "No verification code found");
        }

        if (user.getVerificationExpiry().isBefore(LocalDateTime.now())) {
            return new AuthResponse(null, null, null, "Verification code expired");
        }

        if (!user.getVerificationCode().equals(code)) {
            return new AuthResponse(null, null, null, "Invalid verification code");
        }

        user.setActive(true);
        user.setVerificationCode(null);
        user.setVerificationExpiry(null);
        userRepository.save(user);

        String token = jwtService.generateToken(user.getUsername());
        return new AuthResponse(token, user.getEmail(), user.getFullName(), "Email verified; account activated");
    }

    public AuthResponse forgotPassword(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return new AuthResponse(null, null, null, "If this email exists, a reset code has been sent");
        }

        User user = userOptional.get();
        String otp = generateOtp();
        user.setResetCode(otp);
        user.setResetExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        try {
            emailService.sendResetEmail(user.getEmail(), otp);
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return new AuthResponse(null, user.getEmail(), user.getFullName(), "If this email exists, a reset code has been sent");
    }

    public AuthResponse resetPassword(String email, String code, String newPassword) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return new AuthResponse(null, null, null, "Invalid email or code");
        }

        User user = userOptional.get();
        if (user.getResetCode() == null || user.getResetExpiry() == null) {
            return new AuthResponse(null, null, null, "No reset code found");
        }

        if (user.getResetExpiry().isBefore(LocalDateTime.now())) {
            return new AuthResponse(null, null, null, "Reset code expired");
        }

        if (!user.getResetCode().equals(code)) {
            return new AuthResponse(null, null, null, "Invalid reset code");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetCode(null);
        user.setResetExpiry(null);
        userRepository.save(user);

        return new AuthResponse(null, user.getEmail(), user.getFullName(), "Password reset successful");
    }

    private String generateOtp() {
        Random rnd = new Random();
        int number = 100000 + rnd.nextInt(900000);
        return String.valueOf(number);
    }
}

