package com.example.service;

import com.example.domain.User;
import java.util.Collection;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    /**
     * Adds a new user to the system.
     *
     * @param user the User entity to add (should have name, email, password set; id and createdAt can
     *     be null)
     * @return the created User entity
     */
    User addUser(User user);

    /**
     * Retrieves a user by their ID.
     *
     * @param id the ID of the user
     * @return the User entity
     */
    User getUser(Long id);

    /**
     * Retrieves all users in the system.
     *
     * @return an iterable of all User entities
     */
    Collection<User> getAllUsers();

    /**
     * Updates an existing user's details.
     *
     * @param user the User entity with updated fields (should have a non-null id)
     * @return the updated User entity
     */
    User updateUser(User user);

    /**
     * Deletes a user by their ID.
     *
     * @param id the ID of the user to delete
     */
    void deleteUser(Long id);

    /**
     * Retrieves a user by their email.
     *
     * @param email the email of the user
     * @return the User entity
     */
    User getUserByEmail(String email);
}
