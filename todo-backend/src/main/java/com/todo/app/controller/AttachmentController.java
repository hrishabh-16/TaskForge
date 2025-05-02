package com.todo.app.controller;

import com.todo.app.model.dto.response.AttachmentResponse;
import com.todo.app.service.interfaces.AttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/attachments")
public class AttachmentController {

    @Autowired
    private AttachmentService attachmentService;

    @PostMapping("/tasks/{taskId}")
    public ResponseEntity<AttachmentResponse> uploadAttachment(@PathVariable Long taskId,
                                                             @RequestParam("file") MultipartFile file) {
        AttachmentResponse response = attachmentService.uploadAttachment(taskId, file);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<List<AttachmentResponse>> getAttachmentsByTaskId(@PathVariable Long taskId) {
        List<AttachmentResponse> attachments = attachmentService.getAttachmentsByTaskId(taskId);
        return ResponseEntity.ok(attachments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttachmentResponse> getAttachmentById(@PathVariable Long id) {
        AttachmentResponse response = attachmentService.getAttachmentById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadAttachment(@PathVariable Long id) {
        Resource resource = attachmentService.downloadAttachment(id);
        String contentType = attachmentService.getAttachmentContentType(id);
        String fileName = attachmentService.getAttachmentFileName(id);
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttachment(@PathVariable Long id) {
        attachmentService.deleteAttachment(id);
        return ResponseEntity.noContent().build();
    }
}