package com.todo.app.repository;

import com.todo.app.model.entity.Task;
import com.todo.app.model.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<Task> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, TaskStatus status);
    
    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND " +
           "(LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Task> searchByKeyword(@Param("userId") Long userId, @Param("keyword") String keyword);
    
    List<Task> findByUserIdAndDueDateBetween(Long userId, LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT t FROM Task t WHERE t.dueDate < :now AND t.status != 'COMPLETED' AND t.user.id = :userId")
    List<Task> findOverdueTasks(@Param("userId") Long userId, @Param("now") LocalDateTime now);
    
    @Query("SELECT t FROM Task t WHERE t.dueDate BETWEEN :now AND :reminder AND t.status != 'COMPLETED'")
    List<Task> findTasksForReminder(@Param("now") LocalDateTime now, @Param("reminder") LocalDateTime reminder);
}