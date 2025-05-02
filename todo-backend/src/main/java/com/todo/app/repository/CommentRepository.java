package com.todo.app.repository;

import com.todo.app.model.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    List<Comment> findByTaskIdOrderByCreatedAtDesc(Long taskId);
    
    Optional<Comment> findByIdAndUserId(Long id, Long userId);
    
    Optional<Comment> findByIdAndTaskId(Long id, Long taskId);
}