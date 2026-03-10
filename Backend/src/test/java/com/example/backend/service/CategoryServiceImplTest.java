package com.example.backend.service;

import com.example.backend.dto.response.CategoryResponse;
import com.example.backend.entity.Category;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.service.impl.CategoryServiceImpl;
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
 * White Box Tests — CategoryServiceImpl
 * Tests internal service logic with mocked repository.
 */
@ExtendWith(MockitoExtension.class)
class CategoryServiceImplTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    @Test
    @DisplayName("getAllCategories: returns mapped CategoryResponse list when categories exist")
    void getAllCategories_returnsCategories_whenDataExists() {
        UUID id = UUID.randomUUID();
        LocalDateTime now = LocalDateTime.now();

        Category category = Category.builder()
                .id(id)
                .name("Residential Floor Plans")
                .description("2BHK designs")
                .createdAt(now)
                .build();

        when(categoryRepository.findAll()).thenReturn(List.of(category));

        List<CategoryResponse> result = categoryService.getAllCategories();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).id()).isEqualTo(id);
        assertThat(result.get(0).name()).isEqualTo("Residential Floor Plans");
        assertThat(result.get(0).description()).isEqualTo("2BHK designs");
        assertThat(result.get(0).createdAt()).isEqualTo(now);

        verify(categoryRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("getAllCategories: returns empty list when no categories exist")
    void getAllCategories_returnsEmptyList_whenNoDataExists() {
        when(categoryRepository.findAll()).thenReturn(Collections.emptyList());

        List<CategoryResponse> result = categoryService.getAllCategories();

        assertThat(result).isEmpty();
        verify(categoryRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("getAllCategories: maps multiple categories correctly")
    void getAllCategories_mapsMultipleCategories() {
        List<Category> categories = List.of(
                Category.builder().id(UUID.randomUUID()).name("Residential").description("A").createdAt(LocalDateTime.now()).build(),
                Category.builder().id(UUID.randomUUID()).name("Commercial").description("B").createdAt(LocalDateTime.now()).build()
        );
        when(categoryRepository.findAll()).thenReturn(categories);

        List<CategoryResponse> result = categoryService.getAllCategories();

        assertThat(result).hasSize(2);
        assertThat(result).extracting(CategoryResponse::name)
                .containsExactly("Residential", "Commercial");
    }
}
