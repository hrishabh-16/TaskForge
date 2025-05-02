package com.todo.app.service.impl;

import com.todo.app.model.dto.response.AttachmentResponse;
import com.todo.app.model.entity.Attachment;
import com.todo.app.model.entity.Task;
import com.todo.app.model.entity.User;
import com.todo.app.repository.AttachmentRepository;
import com.todo.app.repository.TaskRepository;
import com.todo.app.repository.UserRepository;
import com.todo.app.service.interfaces.AttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class AttachmentServiceImpl implements AttachmentService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public AttachmentResponse uploadAttachment(Long taskId, MultipartFile file) {
        User currentUser = getCurrentUser();
        
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        // Verify user has access to this task
        if (!task.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to add attachments to this task");
        }
        
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileType = file.getContentType();
        Long fileSize = file.getSize();
        
        // Generate unique file name
        String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
        Path targetLocation = Paths.get(uploadDir).resolve(uniqueFileName);
        
        try {
            // Create upload directory if it doesn't exist
            Files.createDirectories(targetLocation.getParent());
            
            // Copy file to target location
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            // Save attachment info to database
            Attachment attachment = new Attachment();
            attachment.setFileName(fileName);
            attachment.setFileType(fileType);
            attachment.setFilePath(targetLocation.toString());
            attachment.setFileSize(fileSize);
            attachment.setTask(task);
            attachment.setUser(currentUser);
            
            attachment = attachmentRepository.save(attachment);
            return mapToAttachmentResponse(attachment);
            
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    @Override
    public AttachmentResponse getAttachmentById(Long attachmentId) {
        User currentUser = getCurrentUser();
        
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found"));
        
        // Verify user has access to this attachment
        if (!attachment.getTask().getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to view this attachment");
        }
        
        return mapToAttachmentResponse(attachment);
    }

    @Override
    public List<AttachmentResponse> getAttachmentsByTaskId(Long taskId) {
        User currentUser = getCurrentUser();
        
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        // Verify user has access to this task
        if (!task.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to view attachments for this task");
        }
        
        List<Attachment> attachments = attachmentRepository.findByTaskIdOrderByUploadedAtDesc(taskId);
        return attachments.stream()
                .map(this::mapToAttachmentResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Resource downloadAttachment(Long attachmentId) {
        User currentUser = getCurrentUser();
        
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found"));
        
        // Verify user has access to this attachment
        if (!attachment.getTask().getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to download this attachment");
        }
        
        try {
            Path filePath = Paths.get(attachment.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found");
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found", ex);
        }
    }

    @Override
    public String getAttachmentContentType(Long attachmentId) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found"));
        return attachment.getFileType();
    }

    @Override
    public String getAttachmentFileName(Long attachmentId) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found"));
        return attachment.getFileName();
    }

    @Override
    public void deleteAttachment(Long attachmentId) {
        User currentUser = getCurrentUser();
        
        Attachment attachment = attachmentRepository.findByIdAndUserId(attachmentId, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Attachment not found or you don't have permission to delete it"));
        
        // Delete file from file system
        try {
            Path filePath = Paths.get(attachment.getFilePath());
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            // Log error but continue with database deletion
            ex.printStackTrace();
        }
        
        // Delete from database
        attachmentRepository.delete(attachment);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    private AttachmentResponse mapToAttachmentResponse(Attachment attachment) {
        return new AttachmentResponse(
                attachment.getId(),
                attachment.getFileName(),
                attachment.getFileType(),
                attachment.getFileSize(),
                attachment.getTask().getId(),
                attachment.getUser().getId(),
                attachment.getUser().getUsername(),
                attachment.getUploadedAt()
        );
    }
}