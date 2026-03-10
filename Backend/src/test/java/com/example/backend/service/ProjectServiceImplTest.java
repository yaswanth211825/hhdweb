package com.example.backend.service;

import com.example.backend.dto.response.ProjectDetailResponse;
import com.example.backend.dto.response.ProjectSummaryResponse;
import com.example.backend.entity.Category;
import com.example.backend.entity.Project;
import com.example.backend.enums.ProjectStatus;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.ProjectFileRepository;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.service.impl.ProjectServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * White Box Tests — ProjectServiceImpl
 * Tests internal service logic: pagination, filtering, lazy-to-DTO mapping, exception throwing.
 */
@ExtendWith(MockitoExtension.class)
class ProjectServiceImplTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProjectFileRepository projectFileRepository;

    @InjectMocks
    private ProjectServiceImpl projectService;

    private Category category;
    private Project project;

    @BeforeEach
    void setUp() {
        category = Category.builder()
                .id(UUID.randomUUID())
                .name("Residential Floor Plans")
                .description("2BHK designs")
                .createdAt(LocalDateTime.now())
                .build();

        project = Project.builder()
                .id(UUID.randomUUID())
                .title("40x50 West Facing 2BHK")
                .slug("40x50-west-facing-2bhk")
                .location("Bangalore, Karnataka")
                .areaSqft(2000)
                .yearCompleted(2024)
                .description("Spacious 2BHK floor plan.")
                .coverImageUrl("https://happy-home-developers.s3.ap-south-2.amazonaws.com/Projects/floorplans/40X50_WestFacing_2BHK.png")
                .status(ProjectStatus.ACTIVE)
                .category(category)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("getProjects: without categoryId returns all ACTIVE projects")
    void getProjects_noCategoryFilter_returnsAllActive() {
        Page<Project> mockPage = new PageImpl<>(List.of(project));
        when(projectRepository.findAllByStatus(eq(ProjectStatus.ACTIVE), any(Pageable.class)))
                .thenReturn(mockPage);

        Page<ProjectSummaryResponse> result = projectService.getProjects(null, 0, 10);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).slug()).isEqualTo("40x50-west-facing-2bhk");
        assertThat(result.getContent().get(0).categoryName()).isEqualTo("Residential Floor Plans");
        assertThat(result.getContent().get(0).areaSqft()).isEqualTo(2000);

        verify(projectRepository).findAllByStatus(eq(ProjectStatus.ACTIVE), any(Pageable.class));
        verify(projectRepository, never()).findByCategoryIdAndStatus(any(), any(), any());
    }

    @Test
    @DisplayName("getProjects: with categoryId filters by category and ACTIVE status")
    void getProjects_withCategoryId_returnsFiltered() {
        UUID categoryId = category.getId();
        Page<Project> mockPage = new PageImpl<>(List.of(project));
        when(projectRepository.findByCategoryIdAndStatus(eq(categoryId), eq(ProjectStatus.ACTIVE), any(Pageable.class)))
                .thenReturn(mockPage);

        Page<ProjectSummaryResponse> result = projectService.getProjects(categoryId, 0, 10);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).slug()).isEqualTo("40x50-west-facing-2bhk");

        verify(projectRepository).findByCategoryIdAndStatus(eq(categoryId), eq(ProjectStatus.ACTIVE), any(Pageable.class));
        verify(projectRepository, never()).findAllByStatus(any(), any());
    }

    @Test
    @DisplayName("getProjects: returns empty page when no projects match")
    void getProjects_noResults_returnsEmptyPage() {
        when(projectRepository.findAllByStatus(any(), any())).thenReturn(new PageImpl<>(Collections.emptyList()));

        Page<ProjectSummaryResponse> result = projectService.getProjects(null, 0, 10);

        assertThat(result.getContent()).isEmpty();
    }

    @Test
    @DisplayName("getProjectBySlug: returns full ProjectDetailResponse for valid slug")
    void getProjectBySlug_validSlug_returnsDetail() {
        when(projectRepository.findBySlug("40x50-west-facing-2bhk")).thenReturn(Optional.of(project));
        when(projectFileRepository.findByProjectIdOrderByDisplayOrderAsc(project.getId()))
                .thenReturn(Collections.emptyList());

        ProjectDetailResponse result = projectService.getProjectBySlug("40x50-west-facing-2bhk");

        assertThat(result.slug()).isEqualTo("40x50-west-facing-2bhk");
        assertThat(result.title()).isEqualTo("40x50 West Facing 2BHK");
        assertThat(result.areaSqft()).isEqualTo(2000);
        assertThat(result.status()).isEqualTo("ACTIVE");
        assertThat(result.category()).isNotNull();
        assertThat(result.category().name()).isEqualTo("Residential Floor Plans");
        assertThat(result.files()).isEmpty();
    }

    @Test
    @DisplayName("getProjectBySlug: throws ResourceNotFoundException for unknown slug")
    void getProjectBySlug_unknownSlug_throwsNotFoundException() {
        when(projectRepository.findBySlug("non-existent-slug")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.getProjectBySlug("non-existent-slug"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("non-existent-slug");
    }

    @Test
    @DisplayName("getProjectBySlug: handles project with no category (null safe)")
    void getProjectBySlug_projectWithNoCategory_returnsCategoryAsNull() {
        Project noCategory = Project.builder()
                .id(UUID.randomUUID())
                .title("Uncategorised Project")
                .slug("uncategorised")
                .location("Hyderabad")
                .status(ProjectStatus.ACTIVE)
                .category(null)
                .createdAt(LocalDateTime.now())
                .build();

        when(projectRepository.findBySlug("uncategorised")).thenReturn(Optional.of(noCategory));
        when(projectFileRepository.findByProjectIdOrderByDisplayOrderAsc(noCategory.getId()))
                .thenReturn(Collections.emptyList());

        ProjectDetailResponse result = projectService.getProjectBySlug("uncategorised");

        assertThat(result.category()).isNull();
    }
}
