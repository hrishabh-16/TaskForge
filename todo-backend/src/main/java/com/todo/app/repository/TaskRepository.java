package com.todo.app.repository;

import com.todo.app.model.entity.Task;
import com.todo.app.model.entity.User;
import com.todo.app.model.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
	
	  List<Task> findByUser(User user);
    
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
    
    List<Task> findByUserIdAndCategoryId(Long userId, Long categoryId);
    
    List<Task> findByUserIdAndTaskListId(Long userId, Long taskListId);
    
    @Query("SELECT t FROM Task t WHERE t.dueDate < :now AND t.status != 'COMPLETED'")
    List<Task> findOverdueTasks(@Param("now") LocalDateTime now);
    
    @Query("SELECT t FROM Task t WHERE t.user.id = :userId " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:priority IS NULL OR t.priority = :priority) " +
           "AND (:categoryId IS NULL OR t.category.id = :categoryId) " +
           "AND (:taskListId IS NULL OR t.taskList.id = :taskListId) " +
           "AND (:keyword IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:dueDateFrom IS NULL OR t.dueDate >= :dueDateFrom) " +
           "AND (:dueDateTo IS NULL OR t.dueDate <= :dueDateTo)")
    List<Task> filterTasks(@Param("userId") Long userId, 
                          @Param("status") TaskStatus status,
                          @Param("priority") com.todo.app.model.enums.TaskPriority priority,
                          @Param("categoryId") Long categoryId,
                          @Param("taskListId") Long taskListId,
                          @Param("keyword") String keyword,
                          @Param("dueDateFrom") LocalDateTime dueDateFrom,
                          @Param("dueDateTo") LocalDateTime dueDateTo);
}