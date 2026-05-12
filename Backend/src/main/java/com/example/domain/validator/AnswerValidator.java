package com.example.domain.validator;

import com.example.domain.QuizAnswer;
import com.example.exception.ValidationException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class AnswerValidator implements Validator<QuizAnswer>{
    @Override
    public void validate(QuizAnswer answer) throws ValidationException {
        List<String> errors = new ArrayList<>();
        if (answer == null) {
            throw new ValidationException("Answer must not be null");
        }

        if (answer.getText() == null || answer.getText().isBlank()) {
            errors.add("Answer text is required");
        }

        if (answer.getQuestion() == null || answer.getQuestion().getId() == null) {
            errors.add("Answer must belong to a question");
        }

        if (!errors.isEmpty()) {
            throw new ValidationException(String.join(", ", errors));
        }
    }
}
