package com.example.backend.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ProjectDetailResponse(
        UUID id,
        String title,
        String slug,
        String location,
        Integer areaSqft,
        Integer yearCompleted,
        String description,
        String coverImageUrl,
        String status,
        CategoryResponse category,
        List<ProjectFileResponse> files,
        LocalDateTime createdAt
) {
}
