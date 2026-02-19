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

    public ProfileResponse updateProfile(String email, ProfileRequest request) { // update profile data
        Optional<User> userOptional = userRepository.findByEmail(email); // lookup user by email
        if (userOptional.isEmpty()) { // handle missing user
            throw new RuntimeException("User not found"); 
        } 

        User user = userOptional.get(); // unwrap user
        user.setAge(request.getAge()); // update age
        user.setGender(request.getGender()); // update gender
        user.setHeight(request.getHeight()); // update height
        user.setWeight(request.getWeight()); // update weight
        user.setGoals(request.getGoals()); // update goals
        user.setActivityLevel(request.getActivityLevel()); // update activity level
        user.setRecentHealthIssues(request.getRecentHealthIssues()); // update recent issues
        user.setPastHealthIssues(request.getPastHealthIssues()); // update past issues
        user.setProfileCompleted(true); // mark profile complete
        user.setUpdatedAt(LocalDateTime.now()); // set update timestamp

        userRepository.save(user); // persist changes
        return convertToProfileResponse(user); // return response model
    } 

    public ProfileResponse getProfile(String email) { // retrieve profile data
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) { 
            throw new RuntimeException("User not found"); 
        } 
        return convertToProfileResponse(userOptional.get()); 
    } 

    private ProfileResponse convertToProfileResponse(User user) { // map user to response
        ProfileResponse response = new ProfileResponse(); // create response
        response.setId(user.getId()); 
        response.setFullName(user.getFullName()); 
        response.setEmail(user.getEmail()); 
        response.setAge(user.getAge()); 
        response.setGender(user.getGender()); 
        response.setHeight(user.getHeight());
        response.setWeight(user.getWeight()); 
        response.setGoals(user.getGoals()); 
        response.setActivityLevel(user.getActivityLevel()); 
        response.setRecentHealthIssues(user.getRecentHealthIssues()); 
        response.setPastHealthIssues(user.getPastHealthIssues()); 
        response.setProfileCompleted(user.getProfileCompleted()); // map completion flag
        return response; 
    } 
} 
