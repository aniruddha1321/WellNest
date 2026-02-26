package com.wellnest.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;


import com.wellnest.model.HealthTip;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeminiService {
    private final RestTemplate restTemplate = new RestTemplate();


    @Value("${gemini.api.key:Enter_your_api}")
    private String API_KEY;


    private final Random random = new Random();

    // Categorized health images from Unsplash
    private final String[] nutritionImages = {
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800", // Food salad
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800", // Vegetables
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800", // Fruits
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800" // Healthy meal
    };

    private final String[] hydrationImages = {
        "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800", // Water glass
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800", // Water bottle
        "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800", // Water pouring
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800" // Drinking water
    };

    private final String[] fitnessImages = {
        "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800", // Running
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800", // Gym workout
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800", // Yoga
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800" // Exercise
    };

    private final String[] sleepImages = {
        "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=800", // Bedroom/sleep
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800", // Peaceful rest
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800", // Calm sleep
        "https://images.unsplash.com/photo-1444492871235-f1c06df6e554?w=800" // Relaxation
    };

    private final String[] wellnessImages = {
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800", // Nature wellness
        "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800", // Meditation
        "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800", // Mindfulness
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800" // Peaceful scene
    };

    private final String[] categories = {"nutrition", "hydration", "fitness", "sleep", "wellness"};

    public String generateHealthTips(String category) {

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY;

        Map<String, Object> body = new HashMap<>();

        Map<String, String> textPart = new HashMap<>();
        textPart.put("text",
                "Give 5 simple general health tips about " + category +
                ". Do not give medical advice.");

        Map<String, Object> partWrapper = new HashMap<>();
        partWrapper.put("parts", List.of(textPart));

        body.put("contents", List.of(partWrapper));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<Map<String, Object>>(body, headers);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(url, request, Map.class);

        // Extract text from Gemini response
        Map candidate = (Map)((List)response.getBody()
                .get("candidates")).get(0);

        Map content = (Map)candidate.get("content");
        Map part = (Map)((List)content.get("parts")).get(0);

        return part.get("text").toString();
    }

    /**
     * Generate a single health tip with image for display
     */
    public HealthTip generateHealthTipWithImage(String category) {
        // If category is general or empty, pick a random specific category
        String selectedCategory = category;
        if (category == null || category.isEmpty() || category.equalsIgnoreCase("general")) {
            selectedCategory = categories[random.nextInt(categories.length)];
        }

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY;

        Map<String, Object> body = new HashMap<>();

        // Add timestamp to ensure unique responses
        long timestamp = System.currentTimeMillis();
        Map<String, String> textPart = new HashMap<>();
        
        // Category-specific prompts for better matching
        String prompt = getCategoryPrompt(selectedCategory, timestamp);
        textPart.put("text", prompt);

        Map<String, Object> partWrapper = new HashMap<>();
        partWrapper.put("parts", List.of(textPart));

        body.put("contents", List.of(partWrapper));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response =
                    restTemplate.postForEntity(url, request, Map.class);

            // Extract text from Gemini response
            Map candidate = (Map)((List)response.getBody()
                    .get("candidates")).get(0);

            Map content = (Map)candidate.get("content");
            Map part = (Map)((List)content.get("parts")).get(0);

            String tipText = part.get("text").toString();
            String imageUrl = getImageByCategory(selectedCategory);

            System.out.println("Generated " + selectedCategory + " tip at " + timestamp + ": " + tipText.substring(0, Math.min(50, tipText.length())));

            return new HealthTip(tipText, imageUrl, selectedCategory);
        } catch (Exception e) {
            System.err.println("Error generating health tip: " + e.getMessage());
            // Fallback in case of API error
            return new HealthTip(
                "Stay hydrated! Drinking enough water helps your body function at its best.",
                hydrationImages[0],
                "hydration"
            );
        }
    }

    /**
     * Get category-specific prompt for Gemini
     */
    private String getCategoryPrompt(String category, long timestamp) {
        String basePrompt = "Give 1 unique, concise, motivational health tip about %s. " +
                "Keep it under 2 sentences. Make it actionable and positive. " +
                "Do not give medical advice, just general wellness tips. " +
                "Make sure this tip is different from previous ones. Request ID: " + timestamp;

        return switch (category.toLowerCase()) {
            case "nutrition" -> String.format(basePrompt, "healthy eating, nutrition, and balanced diet");
            case "hydration" -> String.format(basePrompt, "drinking water, staying hydrated, and fluid intake");
            case "fitness" -> String.format(basePrompt, "exercise, physical activity, and staying active");
            case "sleep" -> String.format(basePrompt, "sleep quality, rest, and healthy sleep habits");
            case "wellness" -> String.format(basePrompt, "overall wellness, mindfulness, and stress management");
            default -> String.format(basePrompt, "general health and wellness");
        };
    }

    /**
     * Get a random image matching the category
     */
    private String getImageByCategory(String category) {
        String[] images = switch (category.toLowerCase()) {
            case "nutrition" -> nutritionImages;
            case "hydration" -> hydrationImages;
            case "fitness" -> fitnessImages;
            case "sleep" -> sleepImages;
            case "wellness" -> wellnessImages;
            default -> wellnessImages;
        };
        
        int index = random.nextInt(images.length);
        return images[index];
    }
}
