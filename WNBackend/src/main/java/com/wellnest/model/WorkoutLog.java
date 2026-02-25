package com.wellnest.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "workout_logs")
public class WorkoutLog {
    @Id
    private String id;

    @Indexed
    private String username;

    private String exerciseType;
    private Integer durationMinutes;
    private Integer calories;

    @Indexed
    private Instant timestamp;
}
