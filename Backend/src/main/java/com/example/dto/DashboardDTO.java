package com.example.dto;

public class DashboardDTO {
    private BrushingSessionDTO latestBrushing;
    private Long quizzesWithoutMaxScore;
    private Long lessonCount;

    public DashboardDTO() {}

    public DashboardDTO(BrushingSessionDTO latestBrushing, Long quizzesWithoutMaxScore, Long lessonCount) {
        this.latestBrushing = latestBrushing;
        this.quizzesWithoutMaxScore = quizzesWithoutMaxScore;
        this.lessonCount = lessonCount;
    }

    public BrushingSessionDTO getLatestBrushing() {
        return latestBrushing;
    }

    public void setLatestBrushing(BrushingSessionDTO latestBrushing) {
        this.latestBrushing = latestBrushing;
    }

    public Long getQuizzesWithoutMaxScore() {
        return quizzesWithoutMaxScore;
    }

    public void setQuizzesWithoutMaxScore(Long quizzesWithoutMaxScore) {
        this.quizzesWithoutMaxScore = quizzesWithoutMaxScore;
    }

    public Long getLessonCount() {
        return lessonCount;
    }

    public void setLessonCount(Long lessonCount) {
        this.lessonCount = lessonCount;
    }
}
