package com.example.backend.service;

import com.example.backend.entity.Request;
import com.example.backend.enums.RequestStatus;
import com.example.backend.service.impl.NotificationServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * White Box Tests — NotificationServiceImpl
 *
 * @Async has NO effect when called directly without a Spring context (no AOP proxy),
 * so all methods run synchronously here — ideal for unit testing.
 *
 * Covers:
 *  - Email sent when JavaMailSender is configured
 *  - Email skipped (no exception) when JavaMailSender is null
 *  - Email failure caught silently — does NOT propagate to caller
 *  - GoogleSheetsService.appendRequest always called
 *  - Sheets failure caught silently — does NOT propagate
 */
@ExtendWith(MockitoExtension.class)
class NotificationServiceImplTest {

    @Mock private JavaMailSender mailSender;
    @Mock private GoogleSheetsService sheetsService;

    @InjectMocks
    private NotificationServiceImpl notificationService;

    // ── email: happy path ─────────────────────────────────────────────────────

    @Test
    @DisplayName("notifyNewRequest: sends email when JavaMailSender is configured")
    void notifyNewRequest_mailSenderPresent_sendsEmail() {
        // Inject adminEmail via ReflectionTestUtils (normally set by @Value)
        ReflectionTestUtils.setField(notificationService, "adminEmail", "admin@example.com");

        notificationService.notifyNewRequest(buildRequest("Rahul", "rahul@email.com"));

        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    @DisplayName("notifyNewRequest: email contains name and email of requester")
    void notifyNewRequest_emailBodyContainsRequesterDetails() {
        ReflectionTestUtils.setField(notificationService, "adminEmail", "admin@example.com");

        notificationService.notifyNewRequest(buildRequest("Priya", "priya@example.com"));

        verify(mailSender, times(1)).send(argThat((SimpleMailMessage msg) ->
                msg.getText() != null &&
                msg.getText().contains("Priya") &&
                msg.getText().contains("priya@example.com") &&
                msg.getSubject() != null &&
                msg.getSubject().contains("Priya")
        ));
    }

    // ── email: null mailSender (not configured) ───────────────────────────────

    @Test
    @DisplayName("notifyNewRequest: no exception when JavaMailSender is null (not configured)")
    void notifyNewRequest_mailSenderNull_skipsEmailGracefully() {
        // Simulate missing mail configuration: set mailSender field to null
        ReflectionTestUtils.setField(notificationService, "mailSender", null);
        ReflectionTestUtils.setField(notificationService, "adminEmail", "admin@example.com");

        // Must not throw even though mailSender is null
        assertThatCode(() -> notificationService.notifyNewRequest(buildRequest("Kiran", "kiran@email.com")))
                .doesNotThrowAnyException();

        // mailSender was null so send() was never called — sheetsService still called
        verify(sheetsService, times(1)).appendRequest(any(Request.class));
    }

    // ── email: send failure ───────────────────────────────────────────────────

    @Test
    @DisplayName("notifyNewRequest: email MailSendException caught silently, does not propagate")
    void notifyNewRequest_mailSendFails_doesNotThrow() {
        ReflectionTestUtils.setField(notificationService, "adminEmail", "admin@example.com");
        doThrow(new MailSendException("SMTP unavailable"))
                .when(mailSender).send(any(SimpleMailMessage.class));

        assertThatCode(() -> notificationService.notifyNewRequest(buildRequest("Ananya", "a@email.com")))
                .doesNotThrowAnyException();
    }

    // ── sheets: always called ────────────────────────────────────────────────

    @Test
    @DisplayName("notifyNewRequest: always calls sheetsService.appendRequest")
    void notifyNewRequest_alwaysCallsSheetsService() {
        ReflectionTestUtils.setField(notificationService, "adminEmail", "admin@example.com");

        notificationService.notifyNewRequest(buildRequest("Vijay", "vijay@email.com"));

        verify(sheetsService, times(1)).appendRequest(any(Request.class));
    }

    @Test
    @DisplayName("notifyNewRequest: sheets failure caught silently, does not propagate")
    void notifyNewRequest_sheetsFails_doesNotThrow() {
        ReflectionTestUtils.setField(notificationService, "adminEmail", "admin@example.com");
        doThrow(new RuntimeException("Sheets API error"))
                .when(sheetsService).appendRequest(any(Request.class));

        assertThatCode(() -> notificationService.notifyNewRequest(buildRequest("Ram", "ram@email.com")))
                .doesNotThrowAnyException();
    }

    @Test
    @DisplayName("notifyNewRequest: both email and sheets called even when optional phone/message is null")
    void notifyNewRequest_nullOptionalFields_bothServicesStillCalled() {
        ReflectionTestUtils.setField(notificationService, "adminEmail", "admin@example.com");
        Request request = Request.builder()
                .id(UUID.randomUUID())
                .name("Min Fields")
                .email("min@email.com")
                .phone(null)
                .message(null)
                .status(RequestStatus.NEW)
                .createdAt(LocalDateTime.now())
                .build();

        notificationService.notifyNewRequest(request);

        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
        verify(sheetsService, times(1)).appendRequest(request);
    }

    // ── helper ────────────────────────────────────────────────────────────────

    private Request buildRequest(String name, String email) {
        return Request.builder()
                .id(UUID.randomUUID())
                .name(name)
                .email(email)
                .phone("+91-9876543210")
                .message("Test enquiry message")
                .status(RequestStatus.NEW)
                .createdAt(LocalDateTime.now())
                .build();
    }
}
