package com.example.backend.dto.response;

import java.util.UUID;

public record ProjectFileResponse(
        UUID id,
        String fileUrl,
        String fileType,
        String title,
        Integer displayOrder
) {
}
