package com.example.dto;

public class QuestionPostDTO {
    private String intrebare;
    private Long quizId;

    public QuestionPostDTO() {}

    public QuestionPostDTO(String intrebare, String tip, Long quizId) {
        this.intrebare = intrebare;
        this.quizId = quizId;
    }

    public String getIntrebare() {
        return intrebare;
    }

    public void setIntrebare(String intrebare) {
        this.intrebare = intrebare;
    }

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }
}
