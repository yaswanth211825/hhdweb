package com.example.backend.controller;

import com.example.backend.dto.request.CreateRequestDto;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.RequestResponse;
import com.example.backend.service.RequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class RequestController {

    private final RequestService requestService;

    @PostMapping
    public ResponseEntity<ApiResponse<RequestResponse>> createRequest(
            @Valid @RequestBody CreateRequestDto dto
    ) {
        RequestResponse response = requestService.createRequest(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(201, "Enquiry submitted successfully. We will contact you soon!", response));
    }
}
