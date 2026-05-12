package com.example.domain.validator;

import com.example.domain.User;
import com.example.exception.ValidationException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

@Component
public class UserValidator implements Validator<User> {
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$");
    /**
     * Validates the given user. Collects all validation errors and throws a ValidationException with
     * all messages.
     *
     * @param user the user to validate
     * @throws ValidationException if any of the user's fields are invalid
     */
    @Override
    public void validate(User user) throws ValidationException {
        List<String> errors = new ArrayList<>();

        if (!isValidName(user.getName())) {
            errors.add("Name cannot be null or empty!");
        }
        if (!isValidEmail(user.getEmail())) {
            errors.add("Email is invalid or empty!");
        }
        if (!isValidPassword(user.getPassword())) {
            errors.add("Password cannot be null or empty!");
        }

        if (!errors.isEmpty()) {
            throw new ValidationException(String.join(", ", errors));
        }
    }

    public static boolean isValidEmail(String email) {
        return email != null
                && !email.trim().isEmpty()
                && EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    public static boolean isValidName(String name) {
        return name != null && !name.trim().isEmpty();
    }

    public static boolean isValidPassword(String password) {
        return password != null && !password.trim().isEmpty();
    }
}
