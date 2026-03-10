package com.example.backend.service.impl;

import com.example.backend.dto.response.CategoryResponse;
import com.example.backend.dto.response.ProjectDetailResponse;
import com.example.backend.dto.response.ProjectFileResponse;
import com.example.backend.dto.response.ProjectSummaryResponse;
import com.example.backend.entity.Category;
import com.example.backend.entity.Project;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.ProjectFileRepository;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectFileRepository projectFileRepository;

    @Override
    public Page<ProjectSummaryResponse> getProjects(UUID categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Project> projects = (categoryId != null)
                                ? projectRepository.findByCategoryId(categoryId, pageable)
                                : projectRepository.findAll(pageable);

        return projects.map(this::toSummary);
    }

    @Override
    public ProjectDetailResponse getProjectBySlug(String slug) {
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with slug: " + slug));

        List<ProjectFileResponse> files = projectFileRepository
                .findByProjectIdOrderByDisplayOrderAsc(project.getId())
                .stream()
                .map(f -> new ProjectFileResponse(
                        f.getId(),
                        f.getFileUrl(),
                        f.getFileType().name(),
                        f.getTitle(),
                        f.getDisplayOrder()
                ))
                .toList();

        Category cat = project.getCategory();
        CategoryResponse categoryResponse = (cat != null)
                ? new CategoryResponse(cat.getId(), cat.getName(), cat.getDescription(), cat.getCreatedAt())
                : null;

        return new ProjectDetailResponse(
                project.getId(),
                project.getTitle(),
                project.getSlug(),
                project.getLocation(),
                project.getAreaSqft(),
                project.getYearCompleted(),
                project.getDescription(),
                project.getCoverImageUrl(),
                project.getStatus().name(),
                categoryResponse,
                files,
                project.getCreatedAt()
        );
    }

    private ProjectSummaryResponse toSummary(Project p) {
        String categoryName = (p.getCategory() != null) ? p.getCategory().getName() : null;
        return new ProjectSummaryResponse(
                p.getId(),
                p.getTitle(),
                p.getSlug(),
                p.getLocation(),
                p.getAreaSqft(),
                p.getYearCompleted(),
                p.getCoverImageUrl(),
                p.getStatus().name(),
                categoryName
        );
    }
}
