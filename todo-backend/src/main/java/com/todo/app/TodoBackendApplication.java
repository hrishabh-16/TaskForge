package com.todo.app;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class TodoBackendApplication {

    private static final Logger logger = LoggerFactory.getLogger(TodoBackendApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(TodoBackendApplication.class, args);
    }
    
    @EventListener(ApplicationReadyEvent.class)
    public void logStartup() {
        logger.info("TODO App Backend started successfully on port 4000");
        logger.info("Application '{}' is running!", "todo-backend");
    }
}