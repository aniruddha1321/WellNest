package com.wellnest.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WaterIntakeRequest {
    @NotBlank
    @Email
    private String email;

    @PositiveOrZero
    private Double liters;

    @PositiveOrZero
    private Double cups;

    private Instant timestamp;
}
