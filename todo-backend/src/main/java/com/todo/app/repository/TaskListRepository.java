package com.todo.app.repository;

import com.todo.app.model.entity.TaskList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskListRepository extends JpaRepository<TaskList, Long> {
    
    List<TaskList> findByUserIdOrderByNameAsc(Long userId);
    
    Optional<TaskList> findByIdAndUserId(Long id, Long userId);
    
    boolean existsByNameAndUserId(String name, Long userId);
    
    List<TaskList> findByUserIdAndNameContainingIgnoreCase(Long userId, String name);
}