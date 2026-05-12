package com.example.domain.validator;

import com.example.domain.Lesson;
import com.example.exception.ValidationException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class LessonValidator implements Validator<Lesson> {
    @Override
    public void validate(Lesson lesson) throws ValidationException {
        List<String> errors = new ArrayList<>();
        if (lesson == null) {
            throw new ValidationException("Lesson must not be null");
        }

        if (lesson.getTitlu() == null || lesson.getTitlu().isBlank()) {
            errors.add("Lesson title is required");
        }

        if (lesson.getTitlu().trim().length() < 3) {
            errors.add("Lesson title must have at least 3 characters");
        }

        if (lesson.getContentText() == null || lesson.getContentText().isBlank()) {
            errors.add("Lesson content is required");
        }

        if (lesson.getContentText().trim().length() < 10) {
            errors.add("Lesson content must have at least 10 characters");
        }

        if (lesson.getImagineUrls() != null && lesson.getImagineUrls().length() > 500) {
            errors.add("Lesson image URL is too long");
        }

        if (!errors.isEmpty()) {
            throw new ValidationException(String.join(", ", errors));
        }
    }
}
