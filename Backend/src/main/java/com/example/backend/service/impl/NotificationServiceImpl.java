package com.example.backend.service.impl;

import com.example.backend.entity.Request;
import com.example.backend.service.GoogleSheetsService;
import com.example.backend.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class NotificationServiceImpl implements NotificationService {

    // Optional — if mail is not configured the app still works; sends will be skipped
    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Autowired
    private GoogleSheetsService sheetsService;

    @Value("${app.notification.admin-email:yaswanthbopparaju@gmail.com}")
    private String adminEmail;

    /**
     * Runs in the background ("notificationExecutor" thread pool).
     * Never blocks the HTTP response thread.
     */
    @Override
    @Async("notificationExecutor")
    public void notifyNewRequest(Request request) {
        sendEmailNotification(request);
        try {
            sheetsService.appendRequest(request);
        } catch (Exception e) {
            log.error("Failed to update Google Sheet for enquiry {}: {}", request.getId(), e.getMessage());
        }
    }

    // ── email ────────────────────────────────────────────────────────────────

    private void sendEmailNotification(Request request) {
        if (mailSender == null) {
            log.debug("JavaMailSender not configured — skipping email notification");
            return;
        }

        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(adminEmail);
            msg.setSubject("New Enquiry from " + request.getName());
            msg.setText(buildEmailBody(request));
            mailSender.send(msg);
            log.info("Email notification sent for enquiry from {}", request.getEmail());
        } catch (Exception e) {
            // Log but never crash — notification failure must not roll back the saved request
            log.error("Failed to send email for enquiry {}: {}", request.getId(), e.getMessage());
        }
    }

    private String buildEmailBody(Request request) {
        return String.format(
                """
                You have a new service enquiry on HappyHomeDevelopers.

                ─────────────────────────────
                Name    : %s
                Email   : %s
                Phone   : %s
                Message : %s
                ─────────────────────────────
                Received at : %s

                Log in to the admin dashboard to follow up.
                """,
                request.getName(),
                request.getEmail(),
                request.getPhone() != null ? request.getPhone() : "—",
                request.getMessage() != null ? request.getMessage() : "—",
                request.getCreatedAt()
        );
    }
}
