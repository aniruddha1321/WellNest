package com.wellnest.controller;

import com.wellnest.model.MealLog;
import com.wellnest.model.MealLogRequest;
import com.wellnest.service.MealLogService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/meals")
@CrossOrigin(origins = "*")
public class MealLogController {

    private final MealLogService mealLogService;

    public MealLogController(MealLogService mealLogService) {
        this.mealLogService = mealLogService;
    }

    @PostMapping("/log")
    public ResponseEntity<Map<String, Object>> log(@Valid @RequestBody MealLogRequest request) {
        MealLog log = mealLogService.log(request);

        Map<String, Object> result = new HashMap<>();
        result.put("data", log);
        result.put("message", "Meal logged");
        return ResponseEntity.ok(result);
    }

    @GetMapping("/logs")
    public ResponseEntity<Map<String, Object>> logs(@RequestParam String email) {
        List<MealLog> logs = mealLogService.getLogs(email);

        Map<String, Object> result = new HashMap<>();
        result.put("data", logs);
        result.put("message", "Meal logs retrieved");
        return ResponseEntity.ok(result);
    }
}
