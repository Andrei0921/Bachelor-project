package com.example.controller.problem;

import com.example.exception.AiServiceUnavailableException;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice(annotations = BrushingApiErrorResponses.class)
public class BrushingRestExceptionHandler {

    @ExceptionHandler(AiServiceUnavailableException.class)
    public ResponseEntity<Object> handleAiServiceUnavailable(AiServiceUnavailableException ex, HttpServletRequest req) {
        return buildErrorResponse(HttpStatus.SERVICE_UNAVAILABLE, ex.getMessage(), req, List.of());
    }

    private ResponseEntity<Object> buildErrorResponse(
            HttpStatus status, String message, HttpServletRequest req, List<?> errors) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("path", req.getRequestURI());
        body.put("message", message);
        if (!errors.isEmpty()) {
            body.put("details", errors);
        }
        return ResponseEntity.status(status).body(body);
    }
}
