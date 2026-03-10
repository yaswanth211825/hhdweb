package com.example.backend.service;

import com.example.backend.dto.request.CreateRequestDto;
import com.example.backend.dto.response.RequestResponse;
import com.example.backend.entity.Project;
import com.example.backend.entity.Request;
import com.example.backend.enums.RequestStatus;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.RequestRepository;
import com.example.backend.service.impl.RequestServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * White Box Tests — RequestServiceImpl
 * Tests enquiry creation logic: with/without project, invalid project ID, default status.
 */
@ExtendWith(MockitoExtension.class)
class RequestServiceImplTest {

    @Mock
    private RequestRepository requestRepository;

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private RequestServiceImpl requestService;

    @Test
    @DisplayName("createRequest: saves general enquiry (no projectId) with status NEW")
    void createRequest_withoutProjectId_savesGeneralEnquiry() {
        CreateRequestDto dto = new CreateRequestDto("Rahul", "rahul@email.com", "9876543210",
                "Need consultation", null);

        Request saved = Request.builder()
                .id(UUID.randomUUID())
                .name("Rahul")
                .email("rahul@email.com")
                .phone("9876543210")
                .message("Need consultation")
                .status(RequestStatus.NEW)
                .createdAt(LocalDateTime.now())
                .build();

        when(requestRepository.save(any(Request.class))).thenReturn(saved);

        RequestResponse result = requestService.createRequest(dto);

        assertThat(result.name()).isEqualTo("Rahul");
        assertThat(result.email()).isEqualTo("rahul@email.com");
        assertThat(result.status()).isEqualTo("NEW");

        verify(projectRepository, never()).findById(any());
        verify(requestRepository, times(1)).save(any(Request.class));
    }

    @Test
    @DisplayName("createRequest: links project when valid projectId is provided")
    void createRequest_withValidProjectId_linksProject() {
        UUID projectId = UUID.randomUUID();
        Project project = Project.builder().id(projectId).title("40x50 West Facing 2BHK").build();

        CreateRequestDto dto = new CreateRequestDto("Priya", "priya@email.com", null,
                "Interested in this floor plan", projectId);

        Request saved = Request.builder()
                .id(UUID.randomUUID())
                .name("Priya")
                .email("priya@email.com")
                .project(project)
                .status(RequestStatus.NEW)
                .createdAt(LocalDateTime.now())
                .build();

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(requestRepository.save(any(Request.class))).thenReturn(saved);

        RequestResponse result = requestService.createRequest(dto);

        assertThat(result.name()).isEqualTo("Priya");
        assertThat(result.status()).isEqualTo("NEW");

        verify(projectRepository, times(1)).findById(projectId);
        verify(requestRepository, times(1)).save(any(Request.class));
    }

    @Test
    @DisplayName("createRequest: throws ResourceNotFoundException when projectId does not exist")
    void createRequest_withInvalidProjectId_throwsNotFoundException() {
        UUID fakeProjectId = UUID.randomUUID();
        CreateRequestDto dto = new CreateRequestDto("Arjun", "arjun@email.com", null,
                "Query about project", fakeProjectId);

        when(projectRepository.findById(fakeProjectId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> requestService.createRequest(dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining(fakeProjectId.toString());

        verify(requestRepository, never()).save(any());
    }
}
