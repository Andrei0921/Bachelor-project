package com.example.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AnswerPostDTO {
    private String text;

    @JsonProperty("isCorrect")
    private Boolean isCorrect;

    private Long questionId;

    public AnswerPostDTO() {}

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(Boolean correct) {
        isCorrect = correct;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }
}
