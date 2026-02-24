package com.wellnest.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SleepLogRequest {
    @NotBlank
    @Email
    private String email;

    @Positive
    private Double durationHours;

    private String sleepTime;
    private String wakeUpTime;
    private String notes;

    private Instant timestamp;
}
