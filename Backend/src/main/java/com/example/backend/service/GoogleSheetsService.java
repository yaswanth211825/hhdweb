package com.example.backend.service;

import com.example.backend.entity.Request;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.SheetsScopes;
import com.google.api.services.sheets.v4.model.Spreadsheet;
import com.google.api.services.sheets.v4.model.ValueRange;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;

/**
 * Appends a new row to a Google Sheet whenever an enquiry is saved.
 *
 * Setup (one-time):
 * 1. Enable the Google Sheets API in your Google Cloud / Firebase project.
 * 2. Use the same service-account JSON as Firebase (or create a new one).
 * 3. Create a Google Sheet and share it with the service-account email (Editor).
 * 4. Copy the sheet ID from the URL and set GOOGLE_SHEETS_ID env var.
 *
 * Column layout (row appended to Sheet1):
 *   A: ID | B: Name | C: Email | D: Phone | E: Message | F: Status | G: Received At
 */
@Slf4j
@Service
public class GoogleSheetsService {

    @Value("${app.google.sheets.spreadsheet-id:}")
    private String spreadsheetId;

    @Value("${app.firebase.service-account-path:}")
    private String serviceAccountPath;

    @Value("${app.google.sheets.sheet-name:}")
    private String sheetName;

    @Value("${app.google.sheets.column-range:A:G}")
    private String columnRange;

    // Cached Sheets client — built once on first use
    private Sheets sheetsClient;
    private String appendRange;

    public void appendRequest(Request request) {
        if (spreadsheetId == null || spreadsheetId.isBlank()) {
            log.debug("GOOGLE_SHEETS_ID not configured — skipping sheet update");
            return;
        }

        try {
            Sheets service = getSheetsClient();

            List<Object> row = List.of(
                    request.getId().toString(),
                    request.getName(),
                    request.getEmail(),
                    request.getPhone() != null ? request.getPhone() : "",
                    request.getMessage() != null ? request.getMessage() : "",
                    request.getStatus().name(),
                    request.getCreatedAt().toString()
            );

            ValueRange body = new ValueRange().setValues(List.of(row));

            String range = resolveAppendRange(service);

            service.spreadsheets().values()
                    .append(spreadsheetId, range, body)
                    .setValueInputOption("USER_ENTERED")
                    .execute();

            log.info("Enquiry {} appended to Google Sheet range {}", request.getId(), range);

        } catch (Exception e) {
            // Log but never crash — sheet failure must not affect the saved enquiry
            log.error("Failed to append enquiry {} to Google Sheet", request.getId(), e);
        }
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private synchronized Sheets getSheetsClient() throws Exception {
        if (sheetsClient == null) {
            GoogleCredentials credentials = loadCredentials()
                    .createScoped(Collections.singletonList(SheetsScopes.SPREADSHEETS));

            sheetsClient = new Sheets.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance(),
                    new HttpCredentialsAdapter(credentials)
            ).setApplicationName("HappyHomeDevelopers").build();
        }
        return sheetsClient;
    }

    private synchronized String resolveAppendRange(Sheets service) {
        if (appendRange != null && !appendRange.isBlank()) {
            return appendRange;
        }

        String sanitizedColumnRange = (columnRange == null || columnRange.isBlank()) ? "A:G" : columnRange;
        String resolvedSheetName = sheetName;

        if (resolvedSheetName == null || resolvedSheetName.isBlank()) {
            try {
                Spreadsheet spreadsheet = service.spreadsheets().get(spreadsheetId).execute();
                if (spreadsheet.getSheets() != null && !spreadsheet.getSheets().isEmpty()) {
                    resolvedSheetName = spreadsheet.getSheets().get(0).getProperties().getTitle();
                }
            } catch (Exception e) {
                log.warn("Unable to auto-detect Google Sheet tab name. Falling back to Sheet1. Cause: {}", e.getMessage());
            }
        }

        if (resolvedSheetName == null || resolvedSheetName.isBlank()) {
            resolvedSheetName = "Sheet1";
        }

        appendRange = String.format("%s!%s", resolvedSheetName, sanitizedColumnRange);
        return appendRange;
    }

    private GoogleCredentials loadCredentials() throws IOException {
        if (serviceAccountPath == null || serviceAccountPath.isBlank()) {
            return GoogleCredentials.getApplicationDefault();
        }

        File file = new File(serviceAccountPath);
        if (file.exists()) {
            try (InputStream is = new FileInputStream(file)) {
                return GoogleCredentials.fromStream(is);
            }
        }

        try (InputStream is = getClass().getResourceAsStream("/" + serviceAccountPath)) {
            if (is != null) {
                return GoogleCredentials.fromStream(is);
            }
        }

        return GoogleCredentials.getApplicationDefault();
    }
}
