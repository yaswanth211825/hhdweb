package com.example.backend.controller;

import com.example.backend.dto.response.CategoryResponse;
import com.example.backend.dto.response.ProjectDetailResponse;
import com.example.backend.dto.response.ProjectSummaryResponse;
import com.example.backend.exception.GlobalExceptionHandler;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.service.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Black Box Tests — GET /api/projects and GET /api/projects/{slug}
 * Uses standaloneSetup (no Spring context needed — only spring-test / MockMvc required).
 */
@ExtendWith(MockitoExtension.class)
class ProjectControllerTest {

    @Mock
    private ProjectService projectService;

    @InjectMocks
    private ProjectController projectController;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(projectController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("GET /api/projects → 200 with project list and success message")
    void getProjects_withData_returns200() throws Exception {
        ProjectSummaryResponse summary = new ProjectSummaryResponse(
                UUID.randomUUID(), "40x50 West Facing 2BHK", "40x50-west-facing-2bhk",
                "Bangalore, Karnataka", 2000, 2024,
                "https://happy-home-developers.s3.ap-south-2.amazonaws.com/Projects/floorplans/40X50_WestFacing_2BHK.png",
                "ACTIVE", "Residential Floor Plans"
        );
        Page<ProjectSummaryResponse> page = new PageImpl<>(List.of(summary));
        when(projectService.getProjects(isNull(), eq(0), eq(10))).thenReturn(page);

        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Projects fetched successfully"))
                .andExpect(jsonPath("$.data.content[0].slug").value("40x50-west-facing-2bhk"))
                .andExpect(jsonPath("$.data.content[0].areaSqft").value(2000))
                .andExpect(jsonPath("$.data.content[0].categoryName").value("Residential Floor Plans"));
    }

    @Test
    @DisplayName("GET /api/projects → 200 with empty page and 'No projects found' message")
    void getProjects_emptyDb_returns200WithNoResultsMessage() throws Exception {
        when(projectService.getProjects(isNull(), eq(0), eq(10)))
                .thenReturn(new PageImpl<>(Collections.emptyList()));

        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("No projects found. Stay tuned for updates!"))
                .andExpect(jsonPath("$.data.content").isEmpty());
    }

    @Test
    @DisplayName("GET /api/projects?categoryId={id} → 200 filtered by category")
    void getProjects_withCategoryFilter_returns200() throws Exception {
        UUID categoryId = UUID.randomUUID();
        ProjectSummaryResponse summary = new ProjectSummaryResponse(
                UUID.randomUUID(), "30x40 South Facing 2BHK", "30x40-south-facing-2bhk",
                "Bangalore, Karnataka", 1200, 2024, "https://example.com/img.png",
                "ACTIVE", "Residential Floor Plans"
        );
        when(projectService.getProjects(eq(categoryId), eq(0), eq(10)))
                .thenReturn(new PageImpl<>(List.of(summary)));

        mockMvc.perform(get("/api/projects").param("categoryId", categoryId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].slug").value("30x40-south-facing-2bhk"));
    }

    @Test
    @DisplayName("GET /api/projects/{slug} → 200 with project detail")
    void getProjectBySlug_validSlug_returns200() throws Exception {
        CategoryResponse category = new CategoryResponse(
                UUID.randomUUID(), "Residential Floor Plans", "2BHK designs", LocalDateTime.now()
        );
        ProjectDetailResponse detail = new ProjectDetailResponse(
                UUID.randomUUID(), "40x50 West Facing 2BHK", "40x50-west-facing-2bhk",
                "Bangalore, Karnataka", 2000, 2024,
                "Spacious 2BHK floor plan.", "https://example.com/img.png",
                "ACTIVE", category, Collections.emptyList(), LocalDateTime.now()
        );
        when(projectService.getProjectBySlug("40x50-west-facing-2bhk")).thenReturn(detail);

        mockMvc.perform(get("/api/projects/40x50-west-facing-2bhk"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Project fetched successfully"))
                .andExpect(jsonPath("$.data.title").value("40x50 West Facing 2BHK"))
                .andExpect(jsonPath("$.data.areaSqft").value(2000))
                .andExpect(jsonPath("$.data.category.name").value("Residential Floor Plans"))
                .andExpect(jsonPath("$.data.files").isArray());
    }

    @Test
    @DisplayName("GET /api/projects/{slug} → 404 when slug not found (via GlobalExceptionHandler)")
    void getProjectBySlug_unknownSlug_returns404() throws Exception {
        when(projectService.getProjectBySlug("non-existent"))
                .thenThrow(new ResourceNotFoundException("Project not found with slug: non-existent"));

        mockMvc.perform(get("/api/projects/non-existent"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.statusCode").value(404))
                .andExpect(jsonPath("$.message").value("Project not found with slug: non-existent"));
    }
}
