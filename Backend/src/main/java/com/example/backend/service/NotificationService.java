package com.example.backend.service;

import com.example.backend.entity.Request;

public interface NotificationService {

    /**
     * Called after a new enquiry is saved.
     * Implementations should run asynchronously so they never delay the HTTP response.
     */
    void notifyNewRequest(Request request);
}
