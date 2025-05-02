package com.todo.app.service.interfaces;

import com.todo.app.model.dto.request.TaskListRequest;
import com.todo.app.model.dto.response.TaskListResponse;

import java.util.List;

public interface TaskListService {
    
    TaskListResponse createTaskList(TaskListRequest taskListRequest);
    
    TaskListResponse updateTaskList(Long taskListId, TaskListRequest taskListRequest);
    
    TaskListResponse getTaskListById(Long taskListId);
    
    List<TaskListResponse> getAllTaskListsForCurrentUser();
    
    List<TaskListResponse> searchTaskLists(String keyword);
    
    void deleteTaskList(Long taskListId);
}