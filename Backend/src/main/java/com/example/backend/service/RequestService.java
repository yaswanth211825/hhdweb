package com.example.backend.service;

import com.example.backend.dto.request.CreateRequestDto;
import com.example.backend.dto.response.RequestResponse;

public interface RequestService {

    RequestResponse createRequest(CreateRequestDto dto);
}
