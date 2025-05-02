package com.todo.app.mapper;

import com.todo.app.model.dto.request.TaskListRequest;
import com.todo.app.model.dto.response.TaskListResponse;
import com.todo.app.model.entity.TaskList;
import com.todo.app.model.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TaskListMapper {

    public TaskList toTaskList(TaskListRequest taskListRequest, User user) {
        if (taskListRequest == null) {
            return null;
        }

        TaskList taskList = new TaskList();
        taskList.setName(taskListRequest.getName());
        taskList.setDescription(taskListRequest.getDescription());
        taskList.setUser(user);
        
        return taskList;
    }

    public TaskListResponse toTaskListResponse(TaskList taskList) {
        if (taskList == null) {
            return null;
        }

        return new TaskListResponse(
                taskList.getId(),
                taskList.getName(),
                taskList.getDescription(),
                taskList.getUser().getId(),
                taskList.getTasks() != null ? taskList.getTasks().size() : 0,
                taskList.getCreatedAt(),
                taskList.getUpdatedAt()
        );
    }

    public void updateTaskListFromRequest(TaskList taskList, TaskListRequest taskListRequest) {
        if (taskListRequest.getName() != null) {
            taskList.setName(taskListRequest.getName());
        }
        
        if (taskListRequest.getDescription() != null) {
            taskList.setDescription(taskListRequest.getDescription());
        }
    }

    public List<TaskListResponse> toTaskListResponseList(List<TaskList> taskLists) {
        return taskLists.stream()
                .map(this::toTaskListResponse)
                .collect(Collectors.toList());
    }
}