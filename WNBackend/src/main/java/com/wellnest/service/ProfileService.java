package com.wellnest.service;

import com.wellnest.model.User;
import com.wellnest.model.ProfileRequest;
import com.wellnest.model.ProfileResponse;
import com.wellnest.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ProfileService {

    private final UserRepository userRepository;

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ProfileResponse updateProfile(String email, ProfileRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOptional.get();
        user.setAge(request.getAge());
        user.setHeight(request.getHeight());
        user.setWeight(request.getWeight());
        user.setRecentHealthIssues(request.getRecentHealthIssues());
        user.setPastHealthIssues(request.getPastHealthIssues());
        user.setProfileCompleted(true);
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
        return convertToProfileResponse(user);
    }

    public ProfileResponse getProfile(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        return convertToProfileResponse(userOptional.get());
    }

    private ProfileResponse convertToProfileResponse(User user) {
        ProfileResponse response = new ProfileResponse();
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setAge(user.getAge());
        response.setHeight(user.getHeight());
        response.setWeight(user.getWeight());
        response.setRecentHealthIssues(user.getRecentHealthIssues());
        response.setPastHealthIssues(user.getPastHealthIssues());
        response.setProfileCompleted(user.getProfileCompleted());
        return response;
    }
}
