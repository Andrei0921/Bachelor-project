package com.example.domain.validator;

import com.example.exception.ValidationException;

public interface Validator<T> {
    void validate(T entity) throws ValidationException;
}
