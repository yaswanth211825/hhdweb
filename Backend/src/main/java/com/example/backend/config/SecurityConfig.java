package com.example.backend.config;

import com.example.backend.security.FirebaseTokenFilter;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final FirebaseAuth firebaseAuth;

    @Value("${app.cors.allowed-origins:http://localhost:3000}")
    private String allowedOrigins;

    public SecurityConfig(FirebaseAuth firebaseAuth) {
        this.firebaseAuth = firebaseAuth;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // REST APIs are stateless — no CSRF needed
            .csrf(csrf -> csrf.disable())

            // CORS is configured below; Spring Security must honour it
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // No sessions — every request is authenticated via Firebase token
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth
                // Health check — always public (load balancer uses this)
                .requestMatchers("/actuator/health").permitAll()

                // All public browsing endpoints
                .requestMatchers(HttpMethod.GET, "/api/projects/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()

                // Contact form — public so anyone can reach out
                .requestMatchers(HttpMethod.POST, "/api/requests").permitAll()

                // Admin endpoints — require a valid Firebase token
                .requestMatchers("/api/admin/**").authenticated()

                // Everything else is public for now
                .anyRequest().permitAll()
            )

            // Return clean JSON for 401/403 instead of Spring Security's HTML pages
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, e) -> {
                    res.setStatus(401);
                    res.setContentType("application/json");
                    res.getWriter().write(
                        "{\"success\":false,\"statusCode\":401,\"message\":\"Authentication required\"}"
                    );
                })
                .accessDeniedHandler((req, res, e) -> {
                    res.setStatus(403);
                    res.setContentType("application/json");
                    res.getWriter().write(
                        "{\"success\":false,\"statusCode\":403,\"message\":\"Access denied\"}"
                    );
                })
            )

            // Verify Firebase tokens before Spring Security's own auth filter
            .addFilterBefore(
                new FirebaseTokenFilter(firebaseAuth),
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Allow each origin listed in the property (comma-separated)
        Arrays.stream(allowedOrigins.split(","))
              .map(String::trim)
              .filter(s -> !s.isBlank())
              .forEach(config::addAllowedOrigin);

        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
