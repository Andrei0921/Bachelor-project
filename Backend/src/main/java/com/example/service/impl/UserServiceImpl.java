package com.example.service.impl;

import com.example.domain.User;
import com.example.domain.validator.UserValidator;
import com.example.exception.NotFoundException;
import com.example.exception.ValidationException;
import com.example.repository.QuizResultRepository;
import com.example.repository.UserRepository;
import com.example.service.UserService;
import java.util.Collection;
import java.util.Collections;
import java.util.Optional;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final QuizResultRepository quizResultRepository;
    private final UserValidator userValidator;

    public UserServiceImpl(
            UserRepository userRepository, QuizResultRepository quizResultRepository, UserValidator userValidator) {
        this.userRepository = userRepository;
        this.quizResultRepository = quizResultRepository;
        this.userValidator = userValidator;
    }

    @Override
    @Transactional
    public User addUser(User user) {
        userValidator.validate(user);

        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new ValidationException("Email already exists!");
        }
        return userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public User getUser(Long id) {
        if (id == null) throw new IllegalArgumentException("User ID must not be null.");

        return userRepository
                .findById(id)
                .orElseThrow(() -> new NotFoundException("User with id " + id + " not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public Collection<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public User updateUser(User user) {
        if (user == null) throw new IllegalArgumentException("User must not be null.");
        if (user.getId() == null) throw new IllegalArgumentException("Id must not be null.");

        userValidator.validate(user);

        if (userRepository.findById(user.getId()).isEmpty())
            throw new NotFoundException("User with id " + user.getId() + " not found");

        Optional<User> userWithSameEmail = userRepository.findByEmail(user.getEmail());
        if (userWithSameEmail.isPresent() && !userWithSameEmail.get().getId().equals(user.getId())) {
            throw new ValidationException("Email already exists!");
        }

        return userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (id == null) throw new IllegalArgumentException("Id must not be null");

        if (userRepository.findById(id).isEmpty()) throw new NotFoundException("User with id " + id + " not found");

        quizResultRepository.deleteByUserId(id);
        userRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        if (email == null || email.isBlank()) throw new IllegalArgumentException("Email must not be null or blank");

        return userRepository
                .findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User with email " + email + " not found"));
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        String role = user.getRole().name();
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role)));
    }
}
