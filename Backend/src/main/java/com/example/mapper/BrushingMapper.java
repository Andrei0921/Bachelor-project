package com.example.mapper;

import com.example.domain.BrushingSession;
import com.example.domain.BrushingToothResult;
import com.example.dto.BrushingSessionDTO;
import com.example.dto.BrushingToothResultDTO;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class BrushingMapper {

    public static BrushingSessionDTO toSessionDTO(BrushingSession session) {
        BrushingSessionDTO dto = new BrushingSessionDTO();
        dto.setId(session.getId());
        dto.setStartedAt(session.getStartedAt());
        dto.setEndedAt(session.getEndedAt());
        dto.setDurationSeconds(session.getDurationSeconds());
        dto.setOverallScore(session.getOverallScore());
        dto.setOverallResult(session.getOverallResult());
        dto.setToothResults(session.getToothResults().stream()
                .map(BrushingMapper::toToothResultDTO)
                .toList());
        return dto;
    }

    public static BrushingToothResultDTO toToothResultDTO(BrushingToothResult result) {
        BrushingToothResultDTO dto = new BrushingToothResultDTO();
        dto.setId(result.getId());
        dto.setToothName(result.getToothName());
        dto.setTotalTime(result.getTotalTime());
        dto.setAvgSpeed(result.getAvgSpeed());
        dto.setSpeedVariance(result.getSpeedVariance());
        dto.setCircularRatio(result.getCircularRatio());
        dto.setCoverage(result.getCoverage());
        dto.setResult(result.getResult());
        dto.setAdvice(fromAdviceText(result.getAdviceText()));
        return dto;
    }

    private static List<String> fromAdviceText(String adviceText) {
        if (adviceText == null || adviceText.isBlank()) return Collections.emptyList();
        return Arrays.stream(adviceText.split("\\R")).filter(a -> !a.isBlank()).toList();
    }
}
