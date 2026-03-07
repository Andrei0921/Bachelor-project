package com.example.dto;

public class BrushingTrainDTO {
    private double totalTime;
    private double avgSpeed;
    private double speedVariance;
    private double circularRatio;
    private double coverage;

    public BrushingTrainDTO() {}

    public double getTotalTime() {
        return totalTime;
    }

    public void setTotalTime(double totalTime) {
        this.totalTime = totalTime;
    }

    public double getAvgSpeed() {
        return avgSpeed;
    }

    public void setAvgSpeed(double avgSpeed) {
        this.avgSpeed = avgSpeed;
    }

    public double getSpeedVariance() {
        return speedVariance;
    }

    public void setSpeedVariance(double speedVariance) {
        this.speedVariance = speedVariance;
    }

    public double getCircularRatio() {
        return circularRatio;
    }

    public void setCircularRatio(double circularRatio) {
        this.circularRatio = circularRatio;
    }

    public double getCoverage() {
        return coverage;
    }

    public void setCoverage(double coverage) {
        this.coverage = coverage;
    }
}
