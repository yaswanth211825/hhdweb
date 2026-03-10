package com.example.backend.service;

import com.example.backend.dto.response.ProjectFileResponse;
import com.example.backend.entity.Project;
import com.example.backend.entity.ProjectFile;
import com.example.backend.enums.FileType;
import com.example.backend.repository.ProjectFileRepository;
import com.example.backend.service.impl.ProjectFileServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

/**
 * White Box Tests — ProjectFileServiceImpl
 *
 * Covers:
 *  - Files present → correct DTO mapping (all fields)
 *  - No files → empty list returned
 *  - Multiple files with display order preserved
 *  - null title handled gracefully
 */
@ExtendWith(MockitoExtension.class)
class ProjectFileServiceImplTest {

    @Mock  private ProjectFileRepository projectFileRepository;
    @InjectMocks private ProjectFileServiceImpl projectFileService;

    @Test
    @DisplayName("getFilesByProject: returns mapped ProjectFileResponse list when files exist")
    void getFilesByProject_withFiles_returnsMappedList() {
        UUID projectId = UUID.randomUUID();
        Project project = Project.builder().id(projectId).build();

        ProjectFile file = ProjectFile.builder()
                .id(UUID.randomUUID())
                .project(project)
                .fileUrl("https://s3.example.com/plan.png")
                .fileType(FileType.IMAGE)
                .title("West Facing Floor Plan")
                .displayOrder(1)
                .createdAt(LocalDateTime.now())
                .build();

        when(projectFileRepository.findByProjectIdOrderByDisplayOrderAsc(projectId))
                .thenReturn(List.of(file));

        List<ProjectFileResponse> result = projectFileService.getFilesByProject(projectId);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).fileUrl()).isEqualTo("https://s3.example.com/plan.png");
        assertThat(result.get(0).fileType()).isEqualTo("IMAGE");
        assertThat(result.get(0).title()).isEqualTo("West Facing Floor Plan");
        assertThat(result.get(0).displayOrder()).isEqualTo(1);
        assertThat(result.get(0).id()).isNotNull();

        verify(projectFileRepository, times(1))
                .findByProjectIdOrderByDisplayOrderAsc(projectId);
    }

    @Test
    @DisplayName("getFilesByProject: returns empty list when no files for project")
    void getFilesByProject_noFiles_returnsEmptyList() {
        UUID projectId = UUID.randomUUID();
        when(projectFileRepository.findByProjectIdOrderByDisplayOrderAsc(projectId))
                .thenReturn(Collections.emptyList());

        List<ProjectFileResponse> result = projectFileService.getFilesByProject(projectId);

        assertThat(result).isEmpty();
        verify(projectFileRepository, times(1))
                .findByProjectIdOrderByDisplayOrderAsc(projectId);
    }

    @Test
    @DisplayName("getFilesByProject: maps multiple files preserving displayOrder sequence")
    void getFilesByProject_multipleFiles_preservesOrder() {
        UUID projectId = UUID.randomUUID();
        Project project = Project.builder().id(projectId).build();

        List<ProjectFile> files = List.of(
                buildFile(project, "https://s3.example.com/1.png", FileType.IMAGE,   "Front", 1),
                buildFile(project, "https://s3.example.com/2.pdf", FileType.DRAWING, "Plan",  2),
                buildFile(project, "https://s3.example.com/3.pdf", FileType.PDF,     "Specs", 3)
        );
        when(projectFileRepository.findByProjectIdOrderByDisplayOrderAsc(projectId))
                .thenReturn(files);

        List<ProjectFileResponse> result = projectFileService.getFilesByProject(projectId);

        assertThat(result).hasSize(3);
        assertThat(result).extracting(ProjectFileResponse::displayOrder)
                .containsExactly(1, 2, 3);
        assertThat(result).extracting(ProjectFileResponse::fileType)
                .containsExactly("IMAGE", "DRAWING", "PDF");
    }

    @Test
    @DisplayName("getFilesByProject: handles file with null title gracefully")
    void getFilesByProject_nullTitle_returnedAsNull() {
        UUID projectId = UUID.randomUUID();
        Project project = Project.builder().id(projectId).build();

        ProjectFile file = ProjectFile.builder()
                .id(UUID.randomUUID())
                .project(project)
                .fileUrl("https://s3.example.com/plan.png")
                .fileType(FileType.IMAGE)
                .title(null)          // ← explicitly null
                .displayOrder(0)
                .createdAt(LocalDateTime.now())
                .build();

        when(projectFileRepository.findByProjectIdOrderByDisplayOrderAsc(projectId))
                .thenReturn(List.of(file));

        List<ProjectFileResponse> result = projectFileService.getFilesByProject(projectId);

        assertThat(result.get(0).title()).isNull();
    }

    // ── helper ────────────────────────────────────────────────────────────────

    private ProjectFile buildFile(Project project, String url, FileType type, String title, int order) {
        return ProjectFile.builder()
                .id(UUID.randomUUID())
                .project(project)
                .fileUrl(url)
                .fileType(type)
                .title(title)
                .displayOrder(order)
                .createdAt(LocalDateTime.now())
                .build();
    }
}
