package com.example.backend.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

/**
 * Unit Tests — FirebaseTokenFilter
 *
 * Covers:
 *  - No Authorization header → chain continues, no auth set
 *  - Non-Bearer scheme (Basic auth) → chain continues, no auth set
 *  - Valid Bearer token → SecurityContext populated, chain continues
 *  - Invalid/expired token (FirebaseAuthException) → 401, chain STOPS
 *  - Empty token string "Bearer " → 401
 */
@ExtendWith(MockitoExtension.class)
class FirebaseTokenFilterTest {

    @Mock private FirebaseAuth firebaseAuth;
    @Mock private FirebaseToken firebaseToken;

    private FirebaseTokenFilter filter;

    @BeforeEach
    void setUp() {
        filter = new FirebaseTokenFilter(firebaseAuth);
        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    // ── no token → pass through ───────────────────────────────────────────────

    @Test
    @DisplayName("No Authorization header → filter passes through, SecurityContext empty")
    void doFilter_noAuthHeader_chainContinuesAndNoAuthSet() throws Exception {
        MockHttpServletRequest request  = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filter.doFilterInternal(request, response, chain);

        // Chain must have been called
        assertThat(chain.getRequest()).isNotNull();
        // No authentication set
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        // Status not changed (still 200 default)
        assertThat(response.getStatus()).isEqualTo(200);
    }

    @Test
    @DisplayName("Non-Bearer scheme (Basic auth) → filter passes through, SecurityContext empty")
    void doFilter_basicAuthHeader_chainContinues() throws Exception {
        MockHttpServletRequest request  = new MockHttpServletRequest();
        request.addHeader("Authorization", "Basic dXNlcjpwYXNz");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filter.doFilterInternal(request, response, chain);

        assertThat(chain.getRequest()).isNotNull();
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }

    // ── valid token → authenticate ─────────────────────────────────────────────

    @Test
    @DisplayName("Valid Bearer token → SecurityContext populated with correct UID, chain continues")
    void doFilter_validBearerToken_setsSecurityContextAndContinues() throws Exception {
        String validToken = "valid.firebase.id.token";
        when(firebaseToken.getUid()).thenReturn("user-uid-abc123");
        when(firebaseAuth.verifyIdToken(validToken)).thenReturn(firebaseToken);

        MockHttpServletRequest request  = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer " + validToken);
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filter.doFilterInternal(request, response, chain);

        // Chain must have continued
        assertThat(chain.getRequest()).isNotNull();
        // Authentication set with the Firebase UID as principal
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
        assertThat(SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .isEqualTo("user-uid-abc123");
        // ROLE_USER must be granted
        assertThat(SecurityContextHolder.getContext().getAuthentication().getAuthorities())
                .anyMatch(a -> a.getAuthority().equals("ROLE_USER"));
        assertThat(response.getStatus()).isEqualTo(200);
    }

    // ── invalid token → 401 ───────────────────────────────────────────────────

    @Test
    @DisplayName("Invalid Bearer token (FirebaseAuthException) → 401 returned, chain STOPS")
    void doFilter_invalidToken_returns401AndChainStops() throws Exception {
        String badToken = "tampered.or.expired.token";
        FirebaseAuthException authException = mock(FirebaseAuthException.class);
        when(firebaseAuth.verifyIdToken(badToken)).thenThrow(authException);

        MockHttpServletRequest request  = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer " + badToken);
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filter.doFilterInternal(request, response, chain);

        // Chain must NOT have continued
        assertThat(chain.getRequest()).isNull();
        // Status must be 401
        assertThat(response.getStatus()).isEqualTo(401);
        assertThat(response.getContentType()).contains("application/json");
        assertThat(response.getContentAsString()).contains("\"statusCode\":401");
        assertThat(response.getContentAsString()).contains("Invalid or expired authentication token");
        // SecurityContext must be empty
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }

    @Test
    @DisplayName("Empty token 'Bearer ' (no token after prefix) → 401, chain stops")
    void doFilter_emptyTokenAfterBearer_returns401() throws Exception {
        FirebaseAuthException authException = mock(FirebaseAuthException.class);
        when(firebaseAuth.verifyIdToken("")).thenThrow(authException);

        MockHttpServletRequest request  = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer ");  // empty token
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filter.doFilterInternal(request, response, chain);

        assertThat(response.getStatus()).isEqualTo(401);
        assertThat(chain.getRequest()).isNull();
    }
}
