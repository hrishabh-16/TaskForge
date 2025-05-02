package com.todo.app.service.impl;

import com.todo.app.mapper.TaskListMapper;
import com.todo.app.model.dto.request.TaskListRequest;
import com.todo.app.model.dto.response.TaskListResponse;
import com.todo.app.model.entity.TaskList;
import com.todo.app.model.entity.User;
import com.todo.app.repository.TaskListRepository;
import com.todo.app.repository.UserRepository;
import com.todo.app.service.interfaces.TaskListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TaskListServiceImpl implements TaskListService {

    @Autowired
    private TaskListRepository taskListRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TaskListMapper taskListMapper;

    @Override
    public TaskListResponse createTaskList(TaskListRequest taskListRequest) {
        User currentUser = getCurrentUser();
        
        if (taskListRepository.existsByNameAndUserId(taskListRequest.getName(), currentUser.getId())) {
            throw new RuntimeException("Task list with this name already exists");
        }
        
        TaskList taskList = taskListMapper.toTaskList(taskListRequest, currentUser);
        taskList = taskListRepository.save(taskList);
        return taskListMapper.toTaskListResponse(taskList);
    }

    @Override
    public TaskListResponse updateTaskList(Long taskListId, TaskListRequest taskListRequest) {
        User currentUser = getCurrentUser();
        TaskList taskList = taskListRepository.findByIdAndUserId(taskListId, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Task list not found or access denied"));
        
        if (!taskList.getName().equals(taskListRequest.getName()) && 
            taskListRepository.existsByNameAndUserId(taskListRequest.getName(), currentUser.getId())) {
            throw new RuntimeException("Task list with this name already exists");
        }
        
        taskListMapper.updateTaskListFromRequest(taskList, taskListRequest);
        taskList = taskListRepository.save(taskList);
        return taskListMapper.toTaskListResponse(taskList);
    }

    @Override
    public TaskListResponse getTaskListById(Long taskListId) {
        User currentUser = getCurrentUser();
        TaskList taskList = taskListRepository.findByIdAndUserId(taskListId, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Task list not found or access denied"));
        
        return taskListMapper.toTaskListResponse(taskList);
    }

    @Override
    public List<TaskListResponse> getAllTaskListsForCurrentUser() {
        User currentUser = getCurrentUser();
        List<TaskList> taskLists = taskListRepository.findByUserIdOrderByNameAsc(currentUser.getId());
        return taskListMapper.toTaskListResponseList(taskLists);
    }

    @Override
    public List<TaskListResponse> searchTaskLists(String keyword) {
        User currentUser = getCurrentUser();
        List<TaskList> taskLists = taskListRepository.findByUserIdAndNameContainingIgnoreCase(
                currentUser.getId(), keyword);
        return taskListMapper.toTaskListResponseList(taskLists);
    }

    @Override
    public void deleteTaskList(Long taskListId) {
        User currentUser = getCurrentUser();
        TaskList taskList = taskListRepository.findByIdAndUserId(taskListId, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Task list not found or access denied"));
        
        if (!taskList.getTasks().isEmpty()) {
            throw new RuntimeException("Cannot delete task list with existing tasks");
        }
        
        taskListRepository.delete(taskList);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }
}