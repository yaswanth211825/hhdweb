package com.example.backend.repository;

import com.example.backend.entity.Project;
import com.example.backend.enums.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    Optional<Project> findBySlug(String slug);

    Page<Project> findAllByStatus(ProjectStatus status, Pageable pageable);

    Page<Project> findByCategoryId(UUID categoryId, Pageable pageable);

    Page<Project> findByCategoryIdAndStatus(UUID categoryId, ProjectStatus status, Pageable pageable);
}
