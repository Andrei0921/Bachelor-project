package com.example.dto;

import java.util.List;

public class BrushingResponseDTO {
    private String result;
    private List<String> advice;

    public BrushingResponseDTO() {}

    public BrushingResponseDTO(String result, List<String> advice) {
        this.result = result;
        this.advice = advice;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public List<String> getAdvice() {
        return advice;
    }

    public void setAdvice(List<String> advice) {
        this.advice = advice;
    }
}
