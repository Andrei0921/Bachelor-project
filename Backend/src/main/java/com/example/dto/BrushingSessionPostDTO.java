package com.example.dto;

import java.util.List;

public class BrushingSessionPostDTO {
    private Integer durationSeconds;
    private List<BrushingToothResultDTO> toothResults;

    public Integer getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(Integer durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public List<BrushingToothResultDTO> getToothResults() {
        return toothResults;
    }

    public void setToothResults(List<BrushingToothResultDTO> toothResults) {
        this.toothResults = toothResults;
    }
}
