package com.example.backend.controller;

import com.example.backend.dto.response.ProjectFileResponse;
import com.example.backend.exception.GlobalExceptionHandler;
import com.example.backend.service.ProjectFileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Black Box Tests — GET /api/projects/{projectId}/files
 *
 * Covers:
 *  - Files found → 200 with list + "fetched successfully" message
 *  - No files → 200 with empty list + "No files found" message
 *  - Multiple files with all fields mapped correctly
 *  - Service throws RuntimeException → 500
 */
@ExtendWith(MockitoExtension.class)
class ProjectFileControllerTest {

    @Mock  private ProjectFileService projectFileService;
    @InjectMocks private ProjectFileController projectFileController;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(projectFileController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    // ── happy path ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/projects/{id}/files → 200 with file list and success message")
    void getFiles_withFiles_returns200() throws Exception {
        UUID projectId = UUID.randomUUID();
        ProjectFileResponse file = new ProjectFileResponse(
                UUID.randomUUID(),
                "https://happy-home-developers.s3.ap-south-2.amazonaws.com/Projects/floorplans/40X50_WestFacing_2BHK.png",
                "IMAGE", "40x50 West Facing Floor Plan", 1
        );
        when(projectFileService.getFilesByProject(eq(projectId))).thenReturn(List.of(file));

        mockMvc.perform(get("/api/projects/{id}/files", projectId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Project files fetched successfully"))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].fileType").value("IMAGE"))
                .andExpect(jsonPath("$.data[0].title").value("40x50 West Facing Floor Plan"))
                .andExpect(jsonPath("$.data[0].displayOrder").value(1))
                .andExpect(jsonPath("$.data[0].id").isNotEmpty());
    }

    @Test
    @DisplayName("GET /api/projects/{id}/files → 200 with empty list and 'No files found' message")
    void getFiles_noFilesForProject_returns200WithEmptyArrayMessage() throws Exception {
        UUID projectId = UUID.randomUUID();
        when(projectFileService.getFilesByProject(eq(projectId))).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/projects/{id}/files", projectId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("No files found for this project"))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data").isEmpty());
    }

    @Test
    @DisplayName("GET /api/projects/{id}/files → 200 with multiple files in correct order")
    void getFiles_multipleFiles_returnsAllFiles() throws Exception {
        UUID projectId = UUID.randomUUID();
        List<ProjectFileResponse> files = List.of(
                new ProjectFileResponse(UUID.randomUUID(), "https://s3.example.com/img1.png", "IMAGE", "Front View", 1),
                new ProjectFileResponse(UUID.randomUUID(), "https://s3.example.com/drawing.pdf", "DRAWING", "Floor Plan Drawing", 2),
                new ProjectFileResponse(UUID.randomUUID(), "https://s3.example.com/doc.pdf", "PDF", "Specifications", 3)
        );
        when(projectFileService.getFilesByProject(eq(projectId))).thenReturn(files);

        mockMvc.perform(get("/api/projects/{id}/files", projectId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(3))
                .andExpect(jsonPath("$.data[0].fileType").value("IMAGE"))
                .andExpect(jsonPath("$.data[1].fileType").value("DRAWING"))
                .andExpect(jsonPath("$.data[2].fileType").value("PDF"))
                .andExpect(jsonPath("$.data[0].displayOrder").value(1))
                .andExpect(jsonPath("$.data[2].displayOrder").value(3));
    }

    // ── error path ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/projects/{id}/files → 500 when service throws RuntimeException")
    void getFiles_serviceThrows_returns500() throws Exception {
        when(projectFileService.getFilesByProject(any()))
                .thenThrow(new RuntimeException("Storage unavailable"));

        mockMvc.perform(get("/api/projects/{id}/files", UUID.randomUUID()))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.statusCode").value(500))
                .andExpect(jsonPath("$.message").value("Internal server error"));
    }
}
