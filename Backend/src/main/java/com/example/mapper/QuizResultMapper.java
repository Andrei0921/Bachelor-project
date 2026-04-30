package com.example.mapper;

import com.example.domain.Quiz;
import com.example.domain.QuizResult;
import com.example.domain.User;
import com.example.dto.QuizResultDTO;

public class QuizResultMapper {
    public static QuizResult toEntity(QuizResultDTO dto, User user, Quiz quiz) {
        QuizResult entity = new QuizResult();
        entity.setId(dto.getId());
        entity.setUser(user);
        entity.setQuiz(quiz);
        entity.setScor(dto.getScor());
        return entity;
    }

    public static QuizResultDTO toDTO(QuizResult entity) {
        QuizResultDTO dto = new QuizResultDTO();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUser().getId());
        dto.setQuizId(entity.getQuiz().getId());
        dto.setScor(entity.getScor());
        return dto;
    }
}
