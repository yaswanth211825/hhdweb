package com.example.backend.config;

import com.example.backend.entity.Category;
import com.example.backend.entity.Project;
import com.example.backend.entity.ProjectFile;
import com.example.backend.enums.FileType;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProjectFileRepository;
import com.example.backend.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * Seeds the database with sample floor plan projects on startup.
 * Runs only when the database is empty — safe to leave active in development.
 * Disabled in 'prod' profile.
 */
@Component
@RequiredArgsConstructor
@Slf4j
@Profile("!prod")
public class DataInitializer implements CommandLineRunner {

    private static final String S3_BASE =
            "https://happy-home-developers.s3.ap-south-2.amazonaws.com/Projects/floorplans/";

    private final CategoryRepository categoryRepository;
    private final ProjectRepository projectRepository;
    private final ProjectFileRepository projectFileRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            log.info("DataInitializer: data already exists, skipping seed.");
            return;
        }

        log.info("DataInitializer: seeding database with floor plan data...");

        Category residential = categoryRepository.save(
                Category.builder()
                        .name("Residential Floor Plans")
                        .description("2BHK floor plan designs for residential sites of various dimensions and orientations")
                        .build()
        );

        seedProject(residential,
                "40x50 West Facing 2BHK",
                "40x50-west-facing-2bhk",
                2000,
                "Spacious 2BHK floor plan for a 40x50 west-facing site. " +
                "Optimised for natural evening light with a well-ventilated living area and two bedrooms.",
                "40X50_WestFacing_2BHK.png"
        );

        seedProject(residential,
                "40x60 North Facing 2BHK",
                "40x60-north-facing-2bhk",
                2400,
                "Elegant 2BHK floor plan for a 40x60 north-facing site. " +
                "North-facing orientation ensures bright interiors throughout the day with minimal heat gain.",
                "40X60_NorthFacing_2BHK.png"
        );

        seedProject(residential,
                "30x40 South Facing 2BHK",
                "30x40-south-facing-2bhk",
                1200,
                "Compact yet functional 2BHK floor plan for a 30x40 south-facing site. " +
                "Ideal for urban residential plots with efficient space utilisation.",
                "30X40_SouthFacing_2BHK.png"
        );

        seedProject(residential,
                "20x40 West Facing 2BHK",
                "20x40-west-facing-2bhk",
                800,
                "Efficient 2BHK floor plan for a compact 20x40 west-facing site. " +
                "Maximises every square foot for affordable urban living without compromising on comfort.",
                "20X40_WestFacing_2BHK.png"
        );

        log.info("DataInitializer: seeding complete — 1 category, 4 projects, 4 floor plan files added.");
    }

    private void seedProject(Category category, String title, String slug,
                              int areaSqft, String description, String fileName) {
        String fileUrl = S3_BASE + fileName;

        Project project = projectRepository.save(
                Project.builder()
                        .title(title)
                        .slug(slug)
                        .location("Bangalore, Karnataka")
                        .areaSqft(areaSqft)
                        .yearCompleted(2024)
                        .description(description)
                        .coverImageUrl(fileUrl)
                        .category(category)
                        .build()
        );

        projectFileRepository.save(
                ProjectFile.builder()
                        .project(project)
                        .fileUrl(fileUrl)
                        .fileType(FileType.DRAWING)
                        .title(title + " — Floor Plan")
                        .displayOrder(1)
                        .build()
        );
    }
}
