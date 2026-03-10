package com.example.backend.controller;

import com.example.backend.dto.response.RequestResponse;
import com.example.backend.exception.GlobalExceptionHandler;
import com.example.backend.service.RequestService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Black Box Tests — POST /api/requests
 * Uses standaloneSetup (no Spring context needed — only spring-test / MockMvc required).
 * All request bodies use raw JSON strings (no ObjectMapper dependency).
 */
@ExtendWith(MockitoExtension.class)
class RequestControllerTest {

    @Mock
    private RequestService requestService;

    @InjectMocks
    private RequestController requestController;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(requestController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("POST /api/requests → 201 with valid body")
    void createRequest_validBody_returns201() throws Exception {
        RequestResponse response = new RequestResponse(
                UUID.randomUUID(), "Rahul", "rahul@email.com",
                "9876543210", "Need floor plan consultation", "NEW", LocalDateTime.now()
        );
        when(requestService.createRequest(any())).thenReturn(response);

        String body = """
                {
                  "name": "Rahul",
                  "email": "rahul@email.com",
                  "phone": "9876543210",
                  "message": "Need floor plan consultation"
                }
                """;

        mockMvc.perform(post("/api/requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.statusCode").value(201))
                .andExpect(jsonPath("$.message").value("Enquiry submitted successfully. We will contact you soon!"))
                .andExpect(jsonPath("$.data.name").value("Rahul"))
                .andExpect(jsonPath("$.data.status").value("NEW"));
    }

    @Test
    @DisplayName("POST /api/requests → 400 when name is blank")
    void createRequest_blankName_returns400WithFieldError() throws Exception {
        String body = """
                {
                  "name": "",
                  "email": "rahul@email.com",
                  "phone": "9876543210",
                  "message": "Enquiry"
                }
                """;

        mockMvc.perform(post("/api/requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.statusCode").value(400))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.data.name").value("Name is required"));
    }

    @Test
    @DisplayName("POST /api/requests → 400 when email is missing")
    void createRequest_missingEmail_returns400WithFieldError() throws Exception {
        String body = """
                {
                  "name": "Rahul",
                  "phone": "9876543210",
                  "message": "Enquiry"
                }
                """;

        mockMvc.perform(post("/api/requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.data.email").value("Email is required"));
    }

    @Test
    @DisplayName("POST /api/requests → 400 when email format is invalid")
    void createRequest_invalidEmail_returns400WithFieldError() throws Exception {
        String body = """
                {
                  "name": "Rahul",
                  "email": "not-an-email",
                  "phone": "9876543210",
                  "message": "Enquiry"
                }
                """;

        mockMvc.perform(post("/api/requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.data.email").value("Email must be valid"));
    }

    @Test
    @DisplayName("POST /api/requests → 400 when phone exceeds 20 characters")
    void createRequest_phoneTooLong_returns400WithFieldError() throws Exception {
        String body = """
                {
                  "name": "Rahul",
                  "email": "rahul@email.com",
                  "phone": "123456789012345678901",
                  "message": "Enquiry"
                }
                """;

        mockMvc.perform(post("/api/requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.data.phone").value("Phone number must not exceed 20 characters"));
    }
}
