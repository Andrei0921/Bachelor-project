package com.example.dto;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

public class QuestionResponseDTO {
    private Long id;
    private String intrebare;
    private List<AnswerResponseDTO> answers = new ArrayList<>();

    public QuestionResponseDTO() {}

    public QuestionResponseDTO(Long id, String intrebare, List<AnswerResponseDTO> answers) {
        this.id = id;
        this.intrebare = intrebare;
        this.answers = answers;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIntrebare() {
        return intrebare;
    }

    public void setIntrebare(String intrebare) {
        this.intrebare = intrebare;
    }

    public List<AnswerResponseDTO> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerResponseDTO> answers) {
        this.answers = answers;
    }
}
