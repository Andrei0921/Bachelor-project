package com.example.service;

import com.example.dto.BrushingPostDTO;
import com.example.dto.BrushingResponseDTO;
import com.example.dto.BrushingSessionDTO;
import com.example.dto.BrushingSessionPostDTO;
import com.example.dto.BrushingTrainDTO;
import java.util.List;

public interface BrushingService {
    BrushingResponseDTO evaluate(BrushingPostDTO request);

    void appendTrainingRows(List<BrushingTrainDTO> rows);

    BrushingSessionDTO saveSession(Long userId, BrushingSessionPostDTO request);

    List<BrushingSessionDTO> getSessions(Long userId);
}
