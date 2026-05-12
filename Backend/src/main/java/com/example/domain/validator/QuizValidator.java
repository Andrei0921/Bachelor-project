package com.example.domain.validator;

import com.example.domain.Quiz;
import com.example.exception.ValidationException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class QuizValidator implements Validator<Quiz> {

    @Override
    public void validate(Quiz quiz)  throws ValidationException {
        List<String> errors = new ArrayList<>();

        if (quiz == null) {
            throw new ValidationException("Quiz must not be null");
        }

        if (quiz.getTitlu() == null || quiz.getTitlu().isBlank()) {
            errors.add("Quiz title is required");
        }

        if (quiz.getCategorie() == null || quiz.getCategorie().isBlank()) {
            errors.add("Quiz category is required");
        }

        if (!errors.isEmpty()) {
            throw new ValidationException(String.join(", ", errors));
        }
    }
}
