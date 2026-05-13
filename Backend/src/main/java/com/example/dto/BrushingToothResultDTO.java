package com.example.dto;

import java.util.List;

public class BrushingToothResultDTO {
    private Long id;
    private String toothName;
    private Double totalTime;
    private Double avgSpeed;
    private Double speedVariance;
    private Double circularRatio;
    private Double coverage;
    private String result;
    private List<String> advice;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToothName() {
        return toothName;
    }

    public void setToothName(String toothName) {
        this.toothName = toothName;
    }

    public Double getTotalTime() {
        return totalTime;
    }

    public void setTotalTime(Double totalTime) {
        this.totalTime = totalTime;
    }

    public Double getAvgSpeed() {
        return avgSpeed;
    }

    public void setAvgSpeed(Double avgSpeed) {
        this.avgSpeed = avgSpeed;
    }

    public Double getSpeedVariance() {
        return speedVariance;
    }

    public void setSpeedVariance(Double speedVariance) {
        this.speedVariance = speedVariance;
    }

    public Double getCircularRatio() {
        return circularRatio;
    }

    public void setCircularRatio(Double circularRatio) {
        this.circularRatio = circularRatio;
    }

    public Double getCoverage() {
        return coverage;
    }

    public void setCoverage(Double coverage) {
        this.coverage = coverage;
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
