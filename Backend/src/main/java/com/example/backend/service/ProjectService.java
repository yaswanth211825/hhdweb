package com.example.backend.service;

import com.example.backend.dto.response.ProjectDetailResponse;
import com.example.backend.dto.response.ProjectSummaryResponse;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface ProjectService {

    Page<ProjectSummaryResponse> getProjects(UUID categoryId, int page, int size);

    ProjectDetailResponse getProjectBySlug(String slug);
}
