package com.example.backend;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

/**
 * Smoke test — verifies the Spring application context loads successfully.
 * Firebase beans are mocked to avoid requiring real credentials in CI/test environments.
 */
@SpringBootTest
class BackendApplicationTests {

    // Prevent FirebaseConfig from trying to read a real service-account JSON
    @MockitoBean
    private FirebaseApp firebaseApp;

    @MockitoBean
    private FirebaseAuth firebaseAuth;

    @Test
    void contextLoads() {
    }

}
