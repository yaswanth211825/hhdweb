package com.example.backend.service.impl;

import com.example.backend.dto.response.ProjectFileResponse;
import com.example.backend.repository.ProjectFileRepository;
import com.example.backend.service.ProjectFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectFileServiceImpl implements ProjectFileService {

    private final ProjectFileRepository projectFileRepository;

    @Override
    public List<ProjectFileResponse> getFilesByProject(UUID projectId) {
        return projectFileRepository.findByProjectIdOrderByDisplayOrderAsc(projectId)
                .stream()
                .map(f -> new ProjectFileResponse(
                        f.getId(),
                        f.getFileUrl(),
                        f.getFileType().name(),
                        f.getTitle(),
                        f.getDisplayOrder()
                ))
                .toList();
    }
}
