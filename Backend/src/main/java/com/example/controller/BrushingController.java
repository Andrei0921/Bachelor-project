package com.example.controller;

import com.example.dto.BrushingPostDTO;
import com.example.dto.BrushingResponseDTO;
import com.example.dto.BrushingTrainDTO;
import com.example.service.BrushingService;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/brushing")
public class BrushingController {
    private final BrushingService brushingService;

    public BrushingController(BrushingService brushingService) {
        this.brushingService = brushingService;
    }

    @PostMapping(value = "/evaluate", produces = MediaType.APPLICATION_JSON_VALUE)
    public BrushingResponseDTO evaluate(@RequestBody BrushingPostDTO request) {
        return brushingService.evaluate(request);
    }

    @PostMapping("/train-rows")
    public void saveTrainRows(@RequestBody List<BrushingTrainDTO> rows) {
        brushingService.appendTrainingRows(rows);
    }
}
