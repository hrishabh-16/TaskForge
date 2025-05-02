package com.todo.app.service.interfaces;

import com.todo.app.model.dto.response.AttachmentResponse;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AttachmentService {
    
    AttachmentResponse uploadAttachment(Long taskId, MultipartFile file);
    
    AttachmentResponse getAttachmentById(Long attachmentId);
    
    List<AttachmentResponse> getAttachmentsByTaskId(Long taskId);
    
    Resource downloadAttachment(Long attachmentId);
    
    String getAttachmentContentType(Long attachmentId);
    
    String getAttachmentFileName(Long attachmentId);
    
    void deleteAttachment(Long attachmentId);
}