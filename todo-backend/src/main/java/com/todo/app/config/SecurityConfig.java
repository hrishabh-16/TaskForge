package com.todo.app.config;

import com.todo.app.security.jwt.JwtAuthenticationEntryPoint;
import com.todo.app.security.jwt.JwtAuthenticationFilter;
import com.todo.app.security.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;
    
    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler;
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Autowired
    private CorsFilter corsFilter;
    
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsServiceImpl);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                    // Public endpoints
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/api/test/**").permitAll()
                    .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                    .requestMatchers("/error").permitAll()
                    // WebSocket endpoint - ADDED THIS LINE TO FIX THE 401 ERROR
                    .requestMatchers("/ws/**").permitAll()
                    
                    // User endpoints - require authentication
                    .requestMatchers("/api/users/me").authenticated()
                    .requestMatchers("/api/users").hasRole("ADMIN")
                    .requestMatchers("/api/users/**").authenticated()
                    
                    // Task endpoints - require authentication
                    .requestMatchers("/api/tasks/**").authenticated()
                    
                    // Category endpoints - require authentication
                    .requestMatchers("/api/categories/**").authenticated()
                    
                    // Task List endpoints - require authentication
                    .requestMatchers("/api/task-lists/**").authenticated()
                    
                    // Comment endpoints - require authentication
                    .requestMatchers("/api/comments/**").authenticated()
                    
                    // Attachment endpoints - require authentication
                    .requestMatchers("/api/attachments/**").authenticated()
                    
                    //Notification endpoints - require authentication
                    .requestMatchers("/api/notifications/**").authenticated()
                    
                    // Inside the filterChain method, add this line to the authorizeHttpRequests section:
                    .requestMatchers("/api/auth/forgot-password", "/api/auth/reset-password").permitAll()
                    
                    // All other requests require authentication
                    .anyRequest().authenticated()
            );
        
        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(corsFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}