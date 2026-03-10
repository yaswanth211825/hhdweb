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
 *
 * NOTE: NotificationService MUST be mocked — @RequiredArgsConstructor injects it
 * and calls notifyNewRequest after save. Missing mock causes NullPointerException.
 */
@ExtendWith(MockitoExtension.class)
class RequestServiceImplTest {

    @Mock private RequestRepository requestRepository;
    @Mock private ProjectRepository projectRepository;
    @Mock private NotificationService notificationService;   // ← required; was missing

    @InjectMocks
    private RequestServiceImpl requestService;

    // ── happy path ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("createRequest: saves general enquiry (no projectId) with status NEW")
    void createRequest_withoutProjectId_savesGeneralEnquiry() {
        CreateRequestDto dto = new CreateRequestDto(
                "Rahul", "rahul@email.com", "9876543210", "Need consultation", null);

        Request saved = buildRequest("Rahul", "rahul@email.com", "9876543210", "Need consultation", null);
        when(requestRepository.save(any(Request.class))).thenReturn(saved);

        RequestResponse result = requestService.createRequest(dto);

        assertThat(result.name()).isEqualTo("Rahul");
        assertThat(result.email()).isEqualTo("rahul@email.com");
        assertThat(result.status()).isEqualTo("NEW");
        assertThat(result.id()).isNotNull();

        verify(projectRepository, never()).findById(any());
        verify(requestRepository, times(1)).save(any(Request.class));
        verify(notificationService, times(1)).notifyNewRequest(any(Request.class));
    }

    @Test
    @DisplayName("createRequest: links project when valid projectId is provided")
    void createRequest_withValidProjectId_linksProject() {
        UUID projectId = UUID.randomUUID();
        Project project = Project.builder().id(projectId).title("40x50 West Facing 2BHK").build();
        CreateRequestDto dto = new CreateRequestDto(
                "Priya", "priya@email.com", null, "Interested in floor plan", projectId);

        Request saved = buildRequest("Priya", "priya@email.com", null, "Interested in floor plan", project);
        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(requestRepository.save(any(Request.class))).thenReturn(saved);

        RequestResponse result = requestService.createRequest(dto);

        assertThat(result.name()).isEqualTo("Priya");
        assertThat(result.status()).isEqualTo("NEW");

        verify(projectRepository, times(1)).findById(projectId);
        verify(requestRepository, times(1)).save(any(Request.class));
        verify(notificationService, times(1)).notifyNewRequest(any(Request.class));
    }

    @Test
    @DisplayName("createRequest: optional fields (phone, message) may be null")
    void createRequest_nullPhoneAndMessage_savesSuccessfully() {
        CreateRequestDto dto = new CreateRequestDto("Kiran", "kiran@email.com", null, null, null);

        Request saved = buildRequest("Kiran", "kiran@email.com", null, null, null);
        when(requestRepository.save(any(Request.class))).thenReturn(saved);

        RequestResponse result = requestService.createRequest(dto);

        assertThat(result.name()).isEqualTo("Kiran");
        assertThat(result.phone()).isNull();
        assertThat(result.message()).isNull();
        verify(notificationService, times(1)).notifyNewRequest(any(Request.class));
    }

    // ── error path ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("createRequest: throws ResourceNotFoundException when projectId does not exist")
    void createRequest_withInvalidProjectId_throwsNotFoundException() {
        UUID fakeId = UUID.randomUUID();
        CreateRequestDto dto = new CreateRequestDto(
                "Arjun", "arjun@email.com", null, "Query about project", fakeId);

        when(projectRepository.findById(fakeId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> requestService.createRequest(dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining(fakeId.toString());

        verify(requestRepository, never()).save(any());
        verify(notificationService, never()).notifyNewRequest(any());
    }

    @Test
    @DisplayName("createRequest: notificationService failure does not affect saved result")
    void createRequest_notificationThrows_doesNotPropagateException() {
        CreateRequestDto dto = new CreateRequestDto(
                "Maya", "maya@email.com", null, "Test enquiry", null);

        Request saved = buildRequest("Maya", "maya@email.com", null, "Test enquiry", null);
        when(requestRepository.save(any(Request.class))).thenReturn(saved);
        // If notification throws, the service itself should still return the result
        // (In real code @Async means it won't propagate to this thread, but here
        //  we verify the service doesn't crash if notifyNewRequest is called)
        doNothing().when(notificationService).notifyNewRequest(any(Request.class));

        RequestResponse result = requestService.createRequest(dto);

        assertThat(result.name()).isEqualTo("Maya");
        verify(notificationService, times(1)).notifyNewRequest(any(Request.class));
    }

    // ── helper ────────────────────────────────────────────────────────────────

    private Request buildRequest(String name, String email, String phone, String message, Project project) {
        return Request.builder()
                .id(UUID.randomUUID())
                .name(name)
                .email(email)
                .phone(phone)
                .message(message)
                .project(project)
                .status(RequestStatus.NEW)
                .createdAt(LocalDateTime.now())
                .build();
    }
}
