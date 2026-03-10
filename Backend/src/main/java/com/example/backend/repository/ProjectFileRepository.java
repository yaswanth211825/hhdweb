package com.example.backend.repository;

import com.example.backend.entity.ProjectFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProjectFileRepository extends JpaRepository<ProjectFile, UUID> {

    List<ProjectFile> findByProjectIdOrderByDisplayOrderAsc(UUID projectId);
}
