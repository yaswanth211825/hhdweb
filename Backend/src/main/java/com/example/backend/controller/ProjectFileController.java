package com.example.backend.controller;

import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.ProjectFileResponse;
import com.example.backend.service.ProjectFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectFileController {

    private final ProjectFileService projectFileService;

    @GetMapping("/{projectId}/files")
    public ResponseEntity<ApiResponse<List<ProjectFileResponse>>> getFilesByProject(
            @PathVariable UUID projectId
    ) {
        List<ProjectFileResponse> files = projectFileService.getFilesByProject(projectId);

        String message = files.isEmpty()
                ? "No files found for this project"
                : "Project files fetched successfully";

        return ResponseEntity.ok(ApiResponse.success(200, message, files));
    }
}
