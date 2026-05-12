package com.example.domain.validator;


import com.example.domain.QuizQuestion;
import com.example.exception.ValidationException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class QuestionValidator implements Validator<QuizQuestion> {

    @Override
    public void validate(QuizQuestion question) throws ValidationException {
        List<String> errors = new ArrayList<>();
        if (question == null) {
            throw new ValidationException("Question must not be null");
        }

        if (question.getIntrebare() == null || question.getIntrebare().isBlank()) {
            errors.add("Question text is required");
        }

        if (question.getQuiz() == null || question.getQuiz().getId() == null) {
            errors.add("Question must belong to a quiz");
        }

        if (!errors.isEmpty()) {
            throw new ValidationException(String.join(", ", errors));
        }
    }
}
