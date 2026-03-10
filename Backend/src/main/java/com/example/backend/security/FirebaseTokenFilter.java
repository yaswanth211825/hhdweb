package com.example.backend.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Reads the "Authorization: Bearer <firebase-id-token>" header.
 * - No header  → continue chain (public endpoints work normally).
 * - Valid token → set Authentication in SecurityContext (protected endpoints work).
 * - Invalid/expired token → 401 immediately.
 */
public class FirebaseTokenFilter extends OncePerRequestFilter {

    private final FirebaseAuth firebaseAuth;

    public FirebaseTokenFilter(FirebaseAuth firebaseAuth) {
        this.firebaseAuth = firebaseAuth;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // No token — let the request through. Public endpoints won't need auth.
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        try {
            FirebaseToken decoded = firebaseAuth.verifyIdToken(token);
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    decoded.getUid(), null,
                    List.of(new SimpleGrantedAuthority("ROLE_USER"))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
        } catch (FirebaseAuthException e) {
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write(
                    "{\"success\":false,\"statusCode\":401,\"message\":\"Invalid or expired authentication token\"}"
            );
            return;
        }

        chain.doFilter(request, response);
    }
}
