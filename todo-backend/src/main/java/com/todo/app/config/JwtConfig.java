package com.todo.app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private int jwtExpirationInMs;

    public String getJwtSecret() {
        return jwtSecret;
    }

    public int getJwtExpirationInMs() {
        return jwtExpirationInMs;
    }
}