package com.example.backend.service;

import com.example.backend.dto.response.ProjectFileResponse;

import java.util.List;
import java.util.UUID;

public interface ProjectFileService {

    List<ProjectFileResponse> getFilesByProject(UUID projectId);
}
