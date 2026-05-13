package com.example.controller;

import com.example.controller.problem.BrushingApiErrorResponses;
import com.example.dto.BrushingPostDTO;
import com.example.dto.BrushingResponseDTO;
import com.example.dto.BrushingSessionDTO;
import com.example.dto.BrushingSessionPostDTO;
import com.example.dto.BrushingTrainDTO;
import com.example.service.BrushingService;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/brushings")
@BrushingApiErrorResponses
public class BrushingController {
    private final BrushingService brushingService;

    public BrushingController(BrushingService brushingService) {
        this.brushingService = brushingService;
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping(value = "/evaluations", produces = MediaType.APPLICATION_JSON_VALUE)
    public BrushingResponseDTO evaluate(@RequestBody BrushingPostDTO request) {
        return brushingService.evaluate(request);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping(value = "/sessions/users/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public BrushingSessionDTO saveSession(@PathVariable Long userId, @RequestBody BrushingSessionPostDTO request) {
        return brushingService.saveSession(userId, request);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(value = "/sessions/users/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<BrushingSessionDTO> getSessions(@PathVariable Long userId) {
        return brushingService.getSessions(userId);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/training-data")
    public void saveTrainRows(@RequestBody List<BrushingTrainDTO> rows) {
        brushingService.appendTrainingRows(rows);
    }
}
