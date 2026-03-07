package com.example.mapper;

import com.example.domain.QuizAnswer;
import com.example.domain.QuizQuestion;
import com.example.dto.AnswerPostDTO;
import com.example.dto.AnswerResponseDTO;

public class AnswerMapper {

    public static QuizAnswer toEntity(AnswerPostDTO dto, QuizQuestion question) {
        QuizAnswer answer = new QuizAnswer();
        answer.setText(dto.getText());
        answer.setCorrect(dto.isCorrect());
        answer.setQuestion(question);
        return answer;
    }

    public static AnswerResponseDTO toDTO(QuizAnswer answer) {
        return new AnswerResponseDTO(answer.getId(), answer.getText(), answer.isCorrect());
    }
}
