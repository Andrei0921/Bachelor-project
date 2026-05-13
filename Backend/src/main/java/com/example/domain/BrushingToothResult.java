package com.example.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "brushing_tooth_results")
public class BrushingToothResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private BrushingSession session;

    private String toothName;
    private Double totalTime;
    private Double avgSpeed;
    private Double speedVariance;
    private Double circularRatio;
    private Double coverage;
    private String result;

    @Column(length = 2000)
    private String adviceText;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BrushingSession getSession() {
        return session;
    }

    public void setSession(BrushingSession session) {
        this.session = session;
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

    public String getAdviceText() {
        return adviceText;
    }

    public void setAdviceText(String adviceText) {
        this.adviceText = adviceText;
    }
}
