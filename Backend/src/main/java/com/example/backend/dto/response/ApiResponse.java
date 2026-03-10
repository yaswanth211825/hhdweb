package com.example.backend.dto.response;

import java.time.LocalDateTime;

public record ApiResponse<T>(
        boolean success,
        int statusCode,
        String message,
        T data,
        LocalDateTime timestamp
) {
    public static <T> ApiResponse<T> success(int statusCode, String message, T data) {
        return new ApiResponse<>(true, statusCode, message, data, LocalDateTime.now());
    }

    public static <T> ApiResponse<T> error(int statusCode, String message) {
        return new ApiResponse<>(false, statusCode, message, null, LocalDateTime.now());
    }
}
