package com.example.backend.security;

import com.example.backend.config.RateLimitInterceptor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit Tests — RateLimitInterceptor
 *
 * Covers:
 *  - First request always allowed
 *  - 100 requests from same IP all allowed (bucket not exhausted)
 *  - 101st request from same IP is blocked → 429
 *  - Response body on 429 contains correct JSON
 *  - Different IPs have separate independent buckets
 *  - X-Forwarded-For header used as IP (reverse-proxy scenario)
 *  - X-Forwarded-For with comma-separated IPs → first one used
 */
class RateLimitInterceptorTest {

    private RateLimitInterceptor interceptor;

    @BeforeEach
    void setUp() {
        // Fresh interceptor = fresh bucket map for each test
        interceptor = new RateLimitInterceptor();
    }

    @Test
    @DisplayName("First request from any IP → allowed (returns true)")
    void preHandle_firstRequest_returnsTrue() throws Exception {
        boolean result = interceptor.preHandle(
                requestFor("10.0.0.1"), new MockHttpServletResponse(), null);

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("100 requests from same IP → all allowed")
    void preHandle_100RequestsFromSameIp_allAllowed() throws Exception {
        for (int i = 1; i <= 100; i++) {
            boolean allowed = interceptor.preHandle(
                    requestFor("192.168.0.1"), new MockHttpServletResponse(), null);
            assertThat(allowed).as("Request %d should be allowed", i).isTrue();
        }
    }

    @Test
    @DisplayName("101st request from same IP → blocked with 429")
    void preHandle_101stRequestSameIp_blockedWith429() throws Exception {
        String ip = "172.16.0.5";
        for (int i = 0; i < 100; i++) {
            interceptor.preHandle(requestFor(ip), new MockHttpServletResponse(), null);
        }

        MockHttpServletResponse response = new MockHttpServletResponse();
        boolean blocked = interceptor.preHandle(requestFor(ip), response, null);

        assertThat(blocked).isFalse();
        assertThat(response.getStatus()).isEqualTo(429);
        assertThat(response.getContentType()).contains("application/json");
        assertThat(response.getContentAsString()).contains("\"statusCode\":429");
        assertThat(response.getContentAsString()).contains("Too many requests");
    }

    @Test
    @DisplayName("Different IPs have independent buckets — exhausting one does not block another")
    void preHandle_differentIPs_independentBuckets() throws Exception {
        String ipA = "1.1.1.1";
        String ipB = "2.2.2.2";

        // Exhaust bucket for ipA
        for (int i = 0; i < 100; i++) {
            interceptor.preHandle(requestFor(ipA), new MockHttpServletResponse(), null);
        }

        // ipA is now blocked
        MockHttpServletResponse responseA = new MockHttpServletResponse();
        assertThat(interceptor.preHandle(requestFor(ipA), responseA, null)).isFalse();
        assertThat(responseA.getStatus()).isEqualTo(429);

        // ipB is still allowed — its bucket is untouched
        MockHttpServletResponse responseB = new MockHttpServletResponse();
        assertThat(interceptor.preHandle(requestFor(ipB), responseB, null)).isTrue();
        assertThat(responseB.getStatus()).isEqualTo(200);
    }

    @Test
    @DisplayName("X-Forwarded-For header is used as IP when present (reverse-proxy)")
    void preHandle_xForwardedForHeader_usedAsClientIp() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRemoteAddr("10.0.0.1");           // load balancer IP
        request.addHeader("X-Forwarded-For", "203.0.113.42");  // real client IP

        // Exhaust using X-Forwarded-For IP
        for (int i = 0; i < 100; i++) {
            MockHttpServletRequest r = new MockHttpServletRequest();
            r.setRemoteAddr("10.0.0.1");
            r.addHeader("X-Forwarded-For", "203.0.113.42");
            interceptor.preHandle(r, new MockHttpServletResponse(), null);
        }

        MockHttpServletResponse blocked = new MockHttpServletResponse();
        boolean result = interceptor.preHandle(request, blocked, null);

        assertThat(result).isFalse();
        assertThat(blocked.getStatus()).isEqualTo(429);
    }

    @Test
    @DisplayName("X-Forwarded-For with multiple IPs → first IP used (original client)")
    void preHandle_xForwardedForMultipleIps_firstIpUsed() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("X-Forwarded-For", "198.51.100.1, 10.0.0.1, 172.16.0.1");

        // Exhaust using "198.51.100.1" (first IP in chain)
        for (int i = 0; i < 100; i++) {
            MockHttpServletRequest r = new MockHttpServletRequest();
            r.addHeader("X-Forwarded-For", "198.51.100.1, 10.0.0.1");
            interceptor.preHandle(r, new MockHttpServletResponse(), null);
        }

        MockHttpServletResponse blocked = new MockHttpServletResponse();
        boolean result = interceptor.preHandle(request, blocked, null);

        // Should be blocked since 198.51.100.1 bucket is exhausted
        assertThat(result).isFalse();
    }

    // ── helper ────────────────────────────────────────────────────────────────

    private MockHttpServletRequest requestFor(String ip) {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRemoteAddr(ip);
        return request;
    }
}
