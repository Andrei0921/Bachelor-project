package com.example.controller;

import com.example.controller.problem.UserApiErrorResponses;
import com.example.domain.User;
import com.example.domain.UserRole;
import com.example.domain.auth.AuthRequest;
import com.example.domain.auth.AuthResponse;
import com.example.domain.auth.RegisterRequest;
import com.example.security.JwtUtils;
import com.example.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@UserApiErrorResponses
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            UserService userService,
            JwtUtils jwtUtils,
            PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.userService = userService;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
    }

    @Operation(summary = "Register a new user", description = "Creates a new user account")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "User registered successfully",
                        content =
                                @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class))),
                @ApiResponse(responseCode = "400", description = "Invalid registration data", content = @Content)
            })
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Parameter(description = "User registration data") @Valid @RequestBody RegisterRequest request) {

        User user = new User(
                null,
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                UserRole.CLIENT);

        User savedUser = userService.addUser(user);

        Map<String, String> response = new HashMap<>();

        response.put("message", "User " + savedUser.getEmail() + " registered successfully.");
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Login user", description = "Authenticates user and returns JWT token")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Login successful",
                        content =
                                @Content(
                                        mediaType = "application/json",
                                        schema = @Schema(implementation = AuthResponse.class))),
                @ApiResponse(responseCode = "401", description = "Invalid credentials", content = @Content)
            })
    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(
            @Parameter(description = "User login credentials") @RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        User user = userService.getUserByEmail(request.getEmail());
        final String token = jwtUtils.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(token));
    }
}
