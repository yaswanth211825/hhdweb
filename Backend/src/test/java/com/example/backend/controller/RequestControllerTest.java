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
 *
 * Covers:
 *  - Happy path: required-only, all fields, with projectId
 *  - @NotBlank: blank, whitespace-only, null name; blank/missing/invalid email
 *  - @Size: phone at boundary 20 chars (valid) and 21 chars (invalid)
 *  - Empty body {}  /  malformed JSON
 *  - Service throws RuntimeException → 500
 */
@ExtendWith(MockitoExtension.class)
class RequestControllerTest {

    @Mock  private RequestService requestService;
    @InjectMocks private RequestController requestController;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(requestController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    // ── happy path ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("POST /api/requests → 201 with all fields present")
    void createRequest_allFields_returns201() throws Exception {
        when(requestService.createRequest(any())).thenReturn(sampleResponse("Rahul", "9876543210"));

        mockMvc.perform(post("/api/requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                              "name": "Rahul",
                              "email": "rahul@email.com",
                              "phone": "9876543210",
                              "message": "Need floor plan consultation"
                            }"""))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.statusCode").value(201))
                .andExpect(jsonPath("$.message").value("Enquiry submitted successfully. We will contact you soon!"))
                .andExpect(jsonPath("$.data.name").value("Rahul"))
                .andExpect(jsonPath("$.data.status").value("NEW"))
                .andExpect(jsonPath("$.data.id").isNotEmpty())
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    @DisplayName("POST /api/requests → 201 with name + email only (optional fields absent)")
    void createRequest_requiredFieldsOnly_returns201() throws Exception {
        when(requestService.createRequest(any())).thenReturn(sampleResponse("Sita", null));

        mockMvc.perform(post("/api/requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            { "name": "Sita", "email": "sita@email.com" }"""))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.name").value("Sita"));
    }

    @Test
    @DisplayName("POST /api/requests → 201 when projectId UUID is supplied")
    void createRequest_withProjectId_returns201() throws Exception {
        UUID projectId = UUID.randomUUID();
        when(requestService.createRequest(any())).thenReturn(sampleResponse("Dev", null));

        mockMvc.perform(post("/api/requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                              "name": "Dev",
                              "email": "dev@email.com",
                              "projectId": "%s"
                            }""".formatted(projectId)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.name").value("Dev"));
    }

    // ── @NotBlank: name ───────────────────────────────────────────────────────

    @Test
    @DisplayName("POST /api/requests → 400 when name is blank string")
    void createRequest_blankName_returns400() throws Exception {
        mockMvc.perform(post("/api/requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            { "name": "", "email": "x@email.com" }"""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.statusCode").value(400))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.data.name").value("Name is required"));
    }

    @Test
    @DisplayName("POST /api/requests → 400 when name is whitespace-only (NotBlank rejects it)")
    void createRequest_whitespaceOnlyName_returns400() throws Exception {
        mockMvc.perform(post("/api/requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            { "name": "   ", "email": "x@email.com" }"""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.data.name").value("Name is required"));
    }

    // ── @NotBlank / @Email: email ─────────────────────────────────────────────

    @Test
    @DisplayName("POST /api/requests → 400 when email is missing")
    void createRequest_missingEmail_returns400() throws Exception {
        mockMvc.perform(post("/api/requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            { "name": "Rahul", "phone": "9876543210" }"""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.data.email").value("Email is required"));
    }

    @Test
    @DisplayName("POST /api/requests → 400 when email format is invalid")
    void createRequest_invalidEmailFormat_returns400() throws Exception {
        mockMvc.perform(post("/api/requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            { "name": "Rahul", "email": "not-an-email" }"""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.data.email").value("Email must be valid"));
    }

    @Test
    @DisplayName("POST /api/requests → 400 when email is blank")
    void createRequest_blankEmail_returns400() throws Exception {
        mockMvc.perform(post("/api/requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            { "name": "Rahul", "email": "" }"""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.data.email").exists());
    }

    // ── @Size: phone boundary ─────────────────────────────────────────────────

    @Test
    @DisplayName("POST /api/requests → 201 when phone is exactly 20 characters (boundary valid)")
    void createRequest_phone20Chars_returns201() throws Exception {
        String phone20 = "12345678901234567890"; // exactly 20 chars
        when(requestService.createRequest(any())).thenReturn(sampleResponse("Raj", phone20));

        mockMvc.perform(post("/api/requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            { "name": "Raj", "email": "raj@email.com", "phone": "%s" }"""
                                .formatted(phone20)))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("POST /api/requests → 400 when phone is 21 characters (one over boundary)")
    void createRequest_phone21Chars_returns400() throws Exception {
        String phone21 = "123456789012345678901"; // 21 chars

        mockMvc.perform(post("/api/requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            { "name": "Raj", "email": "raj@email.com", "phone": "%s" }"""
                                .formatted(phone21)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.data.phone")
                        .value("Phone number must not exceed 20 characters"));
    }

    // ── empty / malformed body ────────────────────────────────────────────────

    @Test
    @DisplayName("POST /api/requests → 400 when body is empty JSON {} — both required fields missing")
    void createRequest_emptyJsonObject_returns400WithBothFieldErrors() throws Exception {
        mockMvc.perform(post("/api/requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.data.name").value("Name is required"))
                .andExpect(jsonPath("$.data.email").value("Email is required"));
    }

    @Test
    @DisplayName("POST /api/requests → 400 when body is malformed JSON")
    void createRequest_malformedJson_returns400() throws Exception {
        mockMvc.perform(post("/api/requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{ this is not valid json }"))
                .andExpect(status().isBadRequest());
    }

    // ── service exception → 500 ───────────────────────────────────────────────

    @Test
    @DisplayName("POST /api/requests → 500 when service throws unexpected RuntimeException")
    void createRequest_serviceThrowsRuntimeException_returns500() throws Exception {
        when(requestService.createRequest(any()))
                .thenThrow(new RuntimeException("Database connection lost"));

        mockMvc.perform(post("/api/requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            { "name": "Rahul", "email": "rahul@email.com" }"""))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.statusCode").value(500))
                .andExpect(jsonPath("$.message").value("Internal server error"));
    }

    // ── helper ────────────────────────────────────────────────────────────────

    private RequestResponse sampleResponse(String name, String phone) {
        return new RequestResponse(
                UUID.randomUUID(), name, name.toLowerCase().replace(" ", "") + "@email.com",
                phone, "test message", "NEW", LocalDateTime.now()
        );
    }
}
