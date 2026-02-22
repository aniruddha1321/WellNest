package com.wellnest.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutLogRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String exerciseType;

    @Positive
    private Integer durationMinutes;

    @PositiveOrZero
    private Integer calories;

    private Instant timestamp;
}
