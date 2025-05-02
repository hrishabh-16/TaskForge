package com.todo.app.service.impl;

import com.todo.app.model.dto.request.CommentRequest;
import com.todo.app.model.dto.response.CommentResponse;
import com.todo.app.model.entity.Comment;
import com.todo.app.model.entity.Task;
import com.todo.app.model.entity.User;
import com.todo.app.repository.CommentRepository;
import com.todo.app.repository.TaskRepository;
import com.todo.app.repository.UserRepository;
import com.todo.app.service.interfaces.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public CommentResponse createComment(Long taskId, CommentRequest commentRequest) {
        User currentUser = getCurrentUser();
        
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        // Verify user has access to this task
        if (!task.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to comment on this task");
        }
        
        Comment comment = new Comment();
        comment.setContent(commentRequest.getContent());
        comment.setTask(task);
        comment.setUser(currentUser);
        
        comment = commentRepository.save(comment);
        return mapToCommentResponse(comment);
    }

    @Override
    public CommentResponse updateComment(Long commentId, CommentRequest commentRequest) {
        User currentUser = getCurrentUser();
        
        Comment comment = commentRepository.findByIdAndUserId(commentId, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Comment not found or you don't have permission to update it"));
        
        comment.setContent(commentRequest.getContent());
        comment = commentRepository.save(comment);
        return mapToCommentResponse(comment);
    }

    @Override
    public CommentResponse getCommentById(Long commentId) {
        User currentUser = getCurrentUser();
        
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        // Verify user has access to this task
        if (!comment.getTask().getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to view this comment");
        }
        
        return mapToCommentResponse(comment);
    }

    @Override
    public List<CommentResponse> getCommentsByTaskId(Long taskId) {
        User currentUser = getCurrentUser();
        
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        // Verify user has access to this task
        if (!task.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to view comments for this task");
        }
        
        List<Comment> comments = commentRepository.findByTaskIdOrderByCreatedAtDesc(taskId);
        return comments.stream()
                .map(this::mapToCommentResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteComment(Long commentId) {
        User currentUser = getCurrentUser();
        
        Comment comment = commentRepository.findByIdAndUserId(commentId, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Comment not found or you don't have permission to delete it"));
        
        commentRepository.delete(comment);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    private CommentResponse mapToCommentResponse(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getTask().getId(),
                comment.getUser().getId(),
                comment.getUser().getUsername(),
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }
}