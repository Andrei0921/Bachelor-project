package com.example.controller.problem;

import com.example.exception.NotFoundException;
import com.example.exception.ValidationException;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice(annotations = UserApiErrorResponses.class)
public class UserRestExceptionHandler {
    /**
     * Handles validation exceptions and returns a 400 Bad Request response with the exception
     * message.
     */
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "400",
                        description = "Validation failed",
                        content =
                                @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class)))
            })
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Map<String, String>> handleValidation(ValidationException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    /**
     * Handles illegal argument exceptions and returns a 400 Bad Request response with the exception
     * message.
     */
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "400",
                        description = "Invalid argument",
                        content =
                                @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class)))
            })
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    /** Handles not found exceptions and returns a 404 Not Found response. */
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "404",
                        description = "Resource not found",
                        content =
                                @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class)))
            })
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(NotFoundException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    /** Handles other runtime exceptions */
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "500",
                        description = "Internal server error",
                        content =
                                @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class)))
            })
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Internal server error");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    /**
     * Handles data integrity violations, such as unique constraint violations, and returns a 400 Bad
     * Request response.
     */
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "400",
                        description = "Data integrity violation",
                        content =
                                @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class)))
            })
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Data integrity violation: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "401",
                        description = "Invalid credentials",
                        content =
                                @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class)))
            })
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleBadCredentials() {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Invalid credentials");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "401",
                        description = "Authentication failed",
                        content =
                                @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class)))
            })
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, String>> handleAuthenticationException(AuthenticationException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Authentication failed: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "400",
                        description = "Method argument validation failed",
                        content =
                                @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class)))
            })
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .toList();

        Map<String, String> error = new HashMap<>();
        error.put("error", String.join(", ", errors));
        return ResponseEntity.badRequest().body(error);
    }
}
