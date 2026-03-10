package com.example.backend.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record RequestResponse(
        UUID id,
        String name,
        String email,
        String phone,
        String message,
        String status,
        LocalDateTime createdAt
) {
}
