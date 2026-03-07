package com.example.mapper;

import com.example.domain.Quiz;
import com.example.domain.QuizQuestion;
import com.example.dto.QuestionPostDTO;
import com.example.dto.QuestionResponseDTO;

public class QuestionMapper {
    public static QuizQuestion toEntity(QuestionPostDTO dto, Quiz quiz) {
        QuizQuestion q = new QuizQuestion();
        q.setIntrebare(dto.getIntrebare());
        q.setQuiz(quiz);
        return q;
    }

    public static QuestionResponseDTO toDTO(QuizQuestion q) {
        QuestionResponseDTO dto = new QuestionResponseDTO();
        dto.setId(q.getId());
        dto.setIntrebare(q.getIntrebare());
        dto.setAnswers(q.getAnswers().stream().map(AnswerMapper::toDTO).toList());

        return dto;
    }
}
