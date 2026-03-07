package com.example.controller;

import com.example.controller.problem.UserApiErrorResponses;
import com.example.domain.User;
import com.example.dto.UserDTO;
import com.example.mapper.UserMapper;
import com.example.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.util.Collection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@UserApiErrorResponses
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Operation(summary = "Get all users", description = "Returns a list of all users")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Successfully retrieved all users",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = UserDTO.class)))
            })
    @GetMapping()
    public ResponseEntity<Collection<UserDTO>> getAllUsers() {
        logger.info("Received GET request for all users");

        Collection<User> users = userService.getAllUsers();
        Collection<UserDTO> userDTOs = UserMapper.toDtoList(users);
        logger.info("Users retrieved: {}", userDTOs);
        return ResponseEntity.ok(userDTOs);
    }

    @Operation(summary = "Get user by ID", description = "Returns a single user by their ID")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "User found",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = UserDTO.class))),
                @ApiResponse(responseCode = "404", description = "User not found", content = @Content)
            })
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(
            @Parameter(description = "ID of user to be retrieved") @PathVariable Long id) {
        logger.info("Received GET request for user with id: {}", id);

        User user = userService.getUser(id);
        logger.info("User retrieved: {}", user);
        return ResponseEntity.ok(UserMapper.toDto(user));
    }

    @Operation(summary = "Create a new user", description = "Adds a new user to the system")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "User created successfully",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = UserDTO.class))),
                @ApiResponse(responseCode = "400", description = "Invalid user data", content = @Content)
            })
    @PostMapping
    public ResponseEntity<UserDTO> addUser(
            @Parameter(description = "User data to create") @RequestBody UserDTO userDto) {
        logger.info("Received POST request to add user: {}", userDto);

        User userToAdd = UserMapper.fromDto(userDto);
        User createdUser = userService.addUser(userToAdd);
        logger.info("User created: {}", createdUser);
        return ResponseEntity.ok(UserMapper.toDto(createdUser));
    }

    @Operation(summary = "Update user by ID", description = "Updates an existing user")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "User updated successfully",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = UserDTO.class))),
                @ApiResponse(
                        responseCode = "400",
                        description = "Invalid user data or ID mismatch",
                        content = @Content),
                @ApiResponse(responseCode = "404", description = "User not found", content = @Content)
            })
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @Parameter(description = "ID of user to be updated") @PathVariable Long id,
            @Parameter(description = "Updated user data") @RequestBody UserDTO userDto) {
        logger.info("Received PUT request to update user with id: {}. Data: {}", id, userDto);
        if (!id.equals(userDto.getId())) {
            throw new IllegalArgumentException("ID in path and request body do not match.");
        }

        User existingUser = userService.getUser(id);
        boolean passwordChanged = false;

        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            if (userDto.getCurrentPassword() == null
                    || userDto.getCurrentPassword().isEmpty()) {
                throw new IllegalArgumentException("Current password is required to change password");
            }

            if (!passwordEncoder.matches(userDto.getCurrentPassword(), existingUser.getPassword())) {
                throw new IllegalArgumentException("Current password is incorrect");
            }

            existingUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
            passwordChanged = true;
        }

        existingUser.setName(userDto.getName());
        existingUser.setEmail(userDto.getEmail());

        User updatedUser = userService.updateUser(existingUser);

        logger.info("User updated: {}", updatedUser);
        return ResponseEntity.ok(UserMapper.toDto(updatedUser));
    }

    @Operation(summary = "Delete user by ID", description = "Deletes a user from the system")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "204", description = "User deleted successfully", content = @Content),
                @ApiResponse(responseCode = "404", description = "User not found", content = @Content)
            })
    @DeleteMapping("/{id}")
    public ResponseEntity<UserDTO> delete(@Parameter(description = "ID of user to be deleted") @PathVariable Long id) {
        logger.info("Received DELETE request for user with id: {}", id);
        userService.deleteUser(id);
        logger.info("User with id {} deleted.", id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get user by email", description = "Returns a single user by their email address")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "User found",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = UserDTO.class))),
                @ApiResponse(responseCode = "404", description = "User not found", content = @Content)
            })
    @GetMapping("/by-email")
    public ResponseEntity<UserDTO> getUserByEmail(
            @Parameter(description = "Email address of user to be retrieved") @RequestParam String email) {
        logger.info("Received GET request for user with email: {}", email);
        User user = userService.getUserByEmail(email);
        logger.info("User retrieved by email: {}", user);
        return ResponseEntity.ok(UserMapper.toDto(user));
    }
}
