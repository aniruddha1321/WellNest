
package com.wellnest.controller.module_2;
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
    // Method to retrieve all meal logs for a user and returns ResponseEntity containing list of meal logs
    public ResponseEntity<Map<String, Object>> logs(@RequestParam String email) {
        // Calls the mealLogService to fetch all meal logs for the given username or email address
        List<MealLog> logs = mealLogService.getLogs(email);
        Map<String, Object> result = new HashMap<>();
        result.put("data", logs);
        result.put("message", "Meal logs retrieved");
        return ResponseEntity.ok(result);
    }

    // @DeleteMapping annotation maps HTTP DELETE requests to "/api/meals/logs/{id}" endpoint
    @DeleteMapping("/logs/{id}")
    
    public ResponseEntity<Map<String, Object>> delete(@PathVariable String id, @RequestParam String email) {
        
        // Calls the mealLogService to delete the meal log with the specified ID
        mealLogService.delete(id);
        Map<String, Object> result = new HashMap<>();
        result.put("message", "Meal log deleted");
        return ResponseEntity.ok(result);
    }
}
