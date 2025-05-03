package com.todo.app.validation.validator;

import com.todo.app.model.dto.request.SignupRequest;
import com.todo.app.validation.annotation.PasswordMatch;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordMatchValidator implements ConstraintValidator<PasswordMatch, Object> {

    @Override
    public void initialize(PasswordMatch constraintAnnotation) {
    }

    @Override
    public boolean isValid(Object obj, ConstraintValidatorContext context) {
        if (obj instanceof SignupRequest) {
            SignupRequest user = (SignupRequest) obj;
            return user.getPassword() != null && user.getPassword().equals(user.getConfirmPassword());
        }
        return false;
    }
}