package com.example.dto;

import java.util.ArrayList;
import java.util.List;

public class QuizSubmitDTO {
    private Long userId;
    private Long quizId;
    private List<QuizSelectionDTO> answers = new ArrayList<>();

    public QuizSubmitDTO() {}

    public QuizSubmitDTO(Long userId, Long quizId, List<QuizSelectionDTO> answers) {
        this.userId = userId;
        this.quizId = quizId;
        this.answers = answers;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public List<QuizSelectionDTO> getAnswers() {
        return answers;
    }

    public void setAnswers(List<QuizSelectionDTO> answers) {
        this.answers = answers;
    }
}
