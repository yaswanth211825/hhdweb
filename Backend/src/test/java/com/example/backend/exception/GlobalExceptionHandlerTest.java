package com.example.backend.exception;

import com.example.backend.dto.response.ApiResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Unit Tests — GlobalExceptionHandler
 *
 * Covers every @ExceptionHandler method:
 *  - ResourceNotFoundException  → 404 with exception message
 *  - MethodArgumentNotValidException → 400 with field-error map
 *  - AuthenticationException (BadCredentials, InsufficientAuth) → 401
 *  - AccessDeniedException → 403
 *  - Generic RuntimeException → 500 with masked message
 *  - Timestamp always present in response
 */
class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler handler;

    @BeforeEach
    void setUp() {
        handler = new GlobalExceptionHandler();
    }

    // ── 404 ───────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("ResourceNotFoundException → 404, success=false, message = exception text")
    void handleResourceNotFound_returns404WithMessage() {
        ResourceNotFoundException ex = new ResourceNotFoundException("Project not found with slug: abc");

        ResponseEntity<ApiResponse<Void>> response = handler.handleResourceNotFound(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().success()).isFalse();
        assertThat(response.getBody().statusCode()).isEqualTo(404);
        assertThat(response.getBody().message()).isEqualTo("Project not found with slug: abc");
        assertThat(response.getBody().timestamp()).isNotNull();
    }

    @Test
    @DisplayName("ResourceNotFoundException with different message → message is preserved exactly")
    void handleResourceNotFound_preservesExactMessage() {
        String msg = "Category not found with id: 00000000-0000-0000-0000-000000000001";
        ResponseEntity<ApiResponse<Void>> response =
                handler.handleResourceNotFound(new ResourceNotFoundException(msg));

        assertThat(response.getBody().message()).isEqualTo(msg);
    }

    // ── 400 ───────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("MethodArgumentNotValidException → 400, field errors returned as map")
    void handleValidationErrors_returns400WithFieldErrorMap() {
        MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);
        when(ex.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getFieldErrors()).thenReturn(List.of(
                new FieldError("dto", "email", "Email must be valid"),
                new FieldError("dto", "name",  "Name is required")
        ));

        ResponseEntity<ApiResponse<Map<String, String>>> response =
                handler.handleValidationErrors(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody().success()).isFalse();
        assertThat(response.getBody().statusCode()).isEqualTo(400);
        assertThat(response.getBody().message()).isEqualTo("Validation failed");
        assertThat(response.getBody().data())
                .containsEntry("email", "Email must be valid")
                .containsEntry("name",  "Name is required");
    }

    @Test
    @DisplayName("MethodArgumentNotValidException with single field error → map has one entry")
    void handleValidationErrors_singleFieldError_mapHasOneEntry() {
        MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);
        when(ex.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getFieldErrors()).thenReturn(
                List.of(new FieldError("dto", "phone", "Phone number must not exceed 20 characters"))
        );

        ResponseEntity<ApiResponse<Map<String, String>>> response =
                handler.handleValidationErrors(ex);

        assertThat(response.getBody().data()).hasSize(1);
        assertThat(response.getBody().data().get("phone"))
                .isEqualTo("Phone number must not exceed 20 characters");
    }

    // ── 401 ───────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("BadCredentialsException (AuthenticationException) → 401")
    void handleAuthenticationException_badCredentials_returns401() {
        ResponseEntity<ApiResponse<Void>> response =
                handler.handleAuthenticationException(new BadCredentialsException("Bad creds"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody().success()).isFalse();
        assertThat(response.getBody().statusCode()).isEqualTo(401);
        assertThat(response.getBody().message()).isEqualTo("Authentication required");
        assertThat(response.getBody().timestamp()).isNotNull();
    }

    @Test
    @DisplayName("InsufficientAuthenticationException → 401")
    void handleAuthenticationException_insufficientAuth_returns401() {
        ResponseEntity<ApiResponse<Void>> response =
                handler.handleAuthenticationException(
                        new InsufficientAuthenticationException("Token missing"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody().statusCode()).isEqualTo(401);
    }

    // ── 403 ───────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("AccessDeniedException → 403")
    void handleAccessDeniedException_returns403() {
        ResponseEntity<ApiResponse<Void>> response =
                handler.handleAccessDeniedException(new AccessDeniedException("Forbidden"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(response.getBody().success()).isFalse();
        assertThat(response.getBody().statusCode()).isEqualTo(403);
        assertThat(response.getBody().message()).isEqualTo("Access denied");
        assertThat(response.getBody().timestamp()).isNotNull();
    }

    // ── 500 ───────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Generic RuntimeException → 500, message masked as 'Internal server error'")
    void handleGenericException_returns500WithMaskedMessage() {
        ResponseEntity<ApiResponse<Void>> response =
                handler.handleGenericException(new RuntimeException("DB connection lost"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody().success()).isFalse();
        assertThat(response.getBody().statusCode()).isEqualTo(500);
        // Internal details must NOT be leaked — should be a generic message
        assertThat(response.getBody().message()).isEqualTo("Internal server error");
        assertThat(response.getBody().message()).doesNotContain("DB connection lost");
    }

    @Test
    @DisplayName("NullPointerException (uncaught) → 500, message masked")
    void handleGenericException_nullPointerException_returns500() {
        ResponseEntity<ApiResponse<Void>> response =
                handler.handleGenericException(new NullPointerException());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody().statusCode()).isEqualTo(500);
    }

    // ── response structure invariants ─────────────────────────────────────────

    @Test
    @DisplayName("All error responses always include a non-null timestamp")
    void allHandlers_alwaysReturnNonNullTimestamp() {
        assertThat(handler.handleResourceNotFound(new ResourceNotFoundException("x"))
                .getBody().timestamp()).isNotNull();

        assertThat(handler.handleAuthenticationException(new BadCredentialsException("x"))
                .getBody().timestamp()).isNotNull();

        assertThat(handler.handleAccessDeniedException(new AccessDeniedException("x"))
                .getBody().timestamp()).isNotNull();

        assertThat(handler.handleGenericException(new RuntimeException("x"))
                .getBody().timestamp()).isNotNull();
    }
}
