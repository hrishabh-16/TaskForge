package com.todo.app.repository;

import com.todo.app.model.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    
    List<Attachment> findByTaskIdOrderByUploadedAtDesc(Long taskId);
    
    Optional<Attachment> findByIdAndUserId(Long id, Long userId);
    
    Optional<Attachment> findByIdAndTaskId(Long id, Long taskId);
    
    List<Attachment> findByUserId(Long userId);
}