package com.example.controller;

import com.example.dto.BrushingPostDTO;
import com.example.dto.BrushingResponseDTO;
import com.example.dto.BrushingTrainDTO;
import com.example.service.BrushingService;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/brushings")
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

    @PostMapping("/training-data")
    public void saveTrainRows(@RequestBody List<BrushingTrainDTO> rows) {
        brushingService.appendTrainingRows(rows);
    }
}
