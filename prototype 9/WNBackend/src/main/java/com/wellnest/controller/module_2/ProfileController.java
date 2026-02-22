package com.wellnest.controller.module_2;

import com.wellnest.model.ProfileRequest;
import com.wellnest.model.ProfileResponse;
import com.wellnest.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
// Class declaration for ProfileController that handles all profile-related API endpoints
public class ProfileController {
    @Autowired
    private ProfileService profileService;
    @PostMapping("/update")
    // Method to update a user's profile; returns ResponseEntity containing response data and HTTP status
    public ResponseEntity<Map<String, Object>> updateProfile(
            // @RequestParam annotation extracts the "email" query parameter from the request URL (e.g., ?email=user@example.com)
            @RequestParam String email,
            // @Valid and @RequestBody annotations ensure request body is valid JSON and convert it to ProfileRequest object
            @Valid @RequestBody ProfileRequest request) {
        // Try block to handle exceptions that may occur during profile update operation
        try {
            // Calls the profileService to process the profile update request and returns the updated ProfileResponse object
            ProfileResponse response = profileService.updateProfile(email, request);
            // Creates a HashMap to structure the response data as key-value pairs
            Map<String, Object> result = new HashMap<>();
            // Adds the updated profile response object to the response under the "data" key for consistent API structure
            result.put("data", response);
            // Adds a success message to the response under the "message" key to confirm the update
            result.put("message", "Profile updated successfully");
            // Returns the response with HTTP 200 (OK) status and the result map containing profile data
            return ResponseEntity.ok(result);
        // Catch block to handle any exceptions that occur during profile update
        } catch (Exception e) {
            // Prints the exception stack trace to the server console for debugging purposes
            e.printStackTrace();
            // Creates a HashMap to structure the error response data
            Map<String, Object> errorResponse = new HashMap<>();
            // Adds the error message to the response without exposing sensitive stack trace details to the client
            errorResponse.put("message", "Error: " + e.getMessage());
            // Returns HTTP 500 (Internal Server Error) status with the error response body
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // @GetMapping annotation maps HTTP GET requests to "/api/profile/get" endpoint
    @GetMapping("/get")
    // Method to retrieve a user's profile data; returns ResponseEntity containing profile information and HTTP status
    public ResponseEntity<Map<String, Object>> getProfile(@RequestParam String email) {
        // Try block to handle exceptions that may occur during profile retrieval operation
        try {
            // Calls the profileService to fetch the profile data for the given email address
            ProfileResponse response = profileService.getProfile(email);
            // Creates a HashMap to structure the response data as key-value pairs
            Map<String, Object> result = new HashMap<>();
            // Adds the retrieved profile response object to the response under the "data" key to maintain consistent API structure
            result.put("data", response);
            // Adds a success message to the response under the "message" key to confirm data retrieval
            result.put("message", "Profile retrieved successfully");
            // Returns the response with HTTP 200 (OK) status and the result map containing profile data
            return ResponseEntity.ok(result);
        // Catch block to handle any exceptions that occur during profile retrieval
        } catch (Exception e) {
            // Prints the exception stack trace to the server console for debugging purposes
            e.printStackTrace();
            // Creates a HashMap to structure the error response data
            Map<String, Object> errorResponse = new HashMap<>();
            // Adds the error message to the response in a minimal format without exposing sensitive stack trace details to the client
            errorResponse.put("message", "Error: " + e.getMessage());
            // Returns HTTP 500 (Internal Server Error) status with the error response body
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
// Closing brace for the ProfileController class
}
