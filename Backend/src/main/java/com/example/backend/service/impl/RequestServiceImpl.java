package com.example.backend.service.impl;

import com.example.backend.dto.request.CreateRequestDto;
import com.example.backend.dto.response.RequestResponse;
import com.example.backend.entity.Project;
import com.example.backend.entity.Request;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.RequestRepository;
import com.example.backend.service.NotificationService;
import com.example.backend.service.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RequestServiceImpl implements RequestService {

    private final RequestRepository requestRepository;
    private final ProjectRepository projectRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public RequestResponse createRequest(CreateRequestDto dto) {
        Project project = null;

        if (dto.projectId() != null) {
            project = projectRepository.findById(dto.projectId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Project not found with id: " + dto.projectId()
                    ));
        }

        Request request = Request.builder()
                .name(dto.name())
                .email(dto.email())
                .phone(dto.phone())
                .message(dto.message())
                .project(project)
                .build();

        Request saved = requestRepository.save(request);

        // Fire-and-forget: sends email + appends Google Sheet row without blocking the response
        notificationService.notifyNewRequest(saved);

        return new RequestResponse(
                saved.getId(),
                saved.getName(),
                saved.getEmail(),
                saved.getPhone(),
                saved.getMessage(),
                saved.getStatus().name(),
                saved.getCreatedAt()
        );
    }
}
