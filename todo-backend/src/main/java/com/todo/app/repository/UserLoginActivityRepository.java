package com.todo.app.repository;

import com.todo.app.model.entity.User;
import com.todo.app.model.entity.UserLoginActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserLoginActivityRepository extends JpaRepository<UserLoginActivity, Long> {
    List<UserLoginActivity> findByUserOrderByTimestampDesc(User user);
    List<UserLoginActivity> findTop10ByUserOrderByTimestampDesc(User user);
}