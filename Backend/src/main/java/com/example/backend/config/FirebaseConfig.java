package com.example.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Slf4j
@Configuration
public class FirebaseConfig {

    @Value("${app.firebase.service-account-path:}")
    private String serviceAccountPath;

    /**
     * Initialise Firebase Admin SDK once at startup.
     * Used to verify Firebase ID tokens sent by the frontend.
     */
    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }

        GoogleCredentials credentials = resolveCredentials();

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(credentials)
                .build();

        FirebaseApp app = FirebaseApp.initializeApp(options);
        log.info("Firebase Admin SDK initialised");
        return app;
    }

    @Bean
    public FirebaseAuth firebaseAuth(FirebaseApp firebaseApp) {
        return FirebaseAuth.getInstance(firebaseApp);
    }

    // ── credential resolution ────────────────────────────────────────────────

    private GoogleCredentials resolveCredentials() throws IOException {
        if (serviceAccountPath == null || serviceAccountPath.isBlank()) {
            log.info("FIREBASE_SERVICE_ACCOUNT_PATH not set — using Application Default Credentials");
            return GoogleCredentials.getApplicationDefault();
        }

        // Try as a file path on disk
        File file = new File(serviceAccountPath);
        if (file.exists()) {
            log.info("Loading Firebase credentials from file: {}", file.getAbsolutePath());
            try (InputStream is = new FileInputStream(file)) {
                return GoogleCredentials.fromStream(is);
            }
        }

        // Fall back to classpath (useful during local dev when file is in src/main/resources)
        try (InputStream is = getClass().getResourceAsStream("/" + serviceAccountPath)) {
            if (is != null) {
                log.info("Loading Firebase credentials from classpath: {}", serviceAccountPath);
                return GoogleCredentials.fromStream(is);
            }
        }

        log.warn("Service account file '{}' not found — falling back to ADC", serviceAccountPath);
        return GoogleCredentials.getApplicationDefault();
    }
}
