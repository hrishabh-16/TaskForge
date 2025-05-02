package com.todo.app.mapper;

import com.todo.app.model.dto.response.UserResponse;
import com.todo.app.model.entity.User;
import com.todo.app.model.enums.Role;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }

        List<String> roles = user.getRoles().stream()
                .map(Role::name)
                .collect(Collectors.toList());

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                roles,
                user.isEnabled(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

    public List<UserResponse> toUserResponseList(List<User> users) {
        return users.stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }
}