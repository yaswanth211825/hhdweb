package com.example.backend.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Per-IP rate limiter: 100 requests per minute per unique client IP.
 * Uses Bucket4j's token-bucket algorithm — no Redis or external store needed.
 */
@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    // One bucket per client IP — cleaned up naturally as old entries stop being hit
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {

        String ip = extractClientIp(request);
        Bucket bucket = buckets.computeIfAbsent(ip, k -> createBucket());

        if (bucket.tryConsume(1)) {
            return true;
        }

        response.setStatus(429);
        response.setContentType("application/json");
        response.getWriter().write(
                "{\"success\":false,\"statusCode\":429,\"message\":\"Too many requests — please wait a minute and try again.\"}"
        );
        return false;
    }

    private Bucket createBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.builder()
                        .capacity(100)
                        .refillIntervally(100, Duration.ofMinutes(1))
                        .build())
                .build();
    }

    private String extractClientIp(HttpServletRequest request) {
        // Respect reverse-proxy / load-balancer forwarding headers
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
