package com.example.dto;

public class QuizSelectionDTO {
    private Long questionId;
    private Long answerId;

    public QuizSelectionDTO() {}

    public QuizSelectionDTO(Long questionId, Long answerId) {
        this.questionId = questionId;
        this.answerId = answerId;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public Long getAnswerId() {
        return answerId;
    }

    public void setAnswerId(Long answerId) {
        this.answerId = answerId;
    }
}
