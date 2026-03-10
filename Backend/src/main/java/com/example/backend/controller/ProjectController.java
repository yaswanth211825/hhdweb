package com.example.backend.controller;

import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.dto.response.ProjectDetailResponse;
import com.example.backend.dto.response.ProjectSummaryResponse;
import com.example.backend.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<ProjectSummaryResponse>>> getProjects(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ProjectSummaryResponse> projects = projectService.getProjects(categoryId, page, size);

        String message = projects.hasContent()
                ? "Projects fetched successfully"
                : "No projects found. Stay tuned for updates!";

        return ResponseEntity.ok(ApiResponse.success(200, message, PagedResponse.from(projects)));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<ProjectDetailResponse>> getProjectBySlug(@PathVariable String slug) {
        ProjectDetailResponse project = projectService.getProjectBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(200, "Project fetched successfully", project));
    }
}
