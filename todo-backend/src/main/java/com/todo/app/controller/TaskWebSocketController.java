package com.todo.app.controller;

import com.todo.app.model.dto.response.TaskResponse;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class TaskWebSocketController {

    @MessageMapping("/task-update")
    @SendTo("/topic/tasks")
    public TaskResponse broadcastTaskUpdate(TaskResponse taskResponse) {
        return taskResponse;
    }
}