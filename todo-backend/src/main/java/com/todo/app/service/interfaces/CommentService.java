package com.todo.app.service.interfaces;

import com.todo.app.model.dto.request.CommentRequest;
import com.todo.app.model.dto.response.CommentResponse;

import java.util.List;

public interface CommentService {
    
    CommentResponse createComment(Long taskId, CommentRequest commentRequest);
    
    CommentResponse updateComment(Long commentId, CommentRequest commentRequest);
    
    CommentResponse getCommentById(Long commentId);
    
    List<CommentResponse> getCommentsByTaskId(Long taskId);
    
    void deleteComment(Long commentId);
}