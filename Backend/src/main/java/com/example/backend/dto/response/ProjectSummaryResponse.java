package com.example.backend.dto.response;

import java.util.UUID;

public record ProjectSummaryResponse(
        UUID id,
        String title,
        String slug,
        String location,
        Integer areaSqft,
        Integer yearCompleted,
        String coverImageUrl,
        String status,
        String categoryName
) {
}
