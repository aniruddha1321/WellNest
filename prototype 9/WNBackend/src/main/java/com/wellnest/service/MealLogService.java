package com.wellnest.service;

import com.wellnest.model.MealLog;
import com.wellnest.model.MealLogRequest;
import com.wellnest.model.User;
import com.wellnest.repository.MealLogRepository;
import com.wellnest.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class MealLogService {

    private final MealLogRepository mealLogRepository;
    private final UserRepository userRepository;

    public MealLogService(MealLogRepository mealLogRepository, UserRepository userRepository) {
        this.mealLogRepository = mealLogRepository;
        this.userRepository = userRepository;
    }

    public MealLog log(MealLogRequest request) {
        String username = getUsernameByEmail(request.getEmail());
        MealLog log = new MealLog(
            null,
            username,
            request.getMealType(),
            request.getFoodType(),
            request.getCalories(),
            request.getProtein(),
            request.getCarbs(),
            request.getFats(),
            request.getNotes(),
            request.getTimestamp() != null ? request.getTimestamp() : Instant.now()
        );
        return mealLogRepository.save(log);//saves the log to database
    }

    public List<MealLog> getLogs(String email) {
        String username = getUsernameByEmail(email);
        return mealLogRepository.findByUsernameOrderByTimestampDesc(username);
    }

    public void delete(String id) {
        mealLogRepository.deleteById(id);
    }

    private String getUsernameByEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        String username = user.getUsername();
        if (username == null || username.isBlank()) {
            throw new RuntimeException("Username not set");
        }
        return username;
    }
}
