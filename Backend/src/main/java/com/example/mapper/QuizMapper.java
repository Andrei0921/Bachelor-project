package com.example.mapper;

import com.example.domain.Quiz;
import com.example.dto.QuizPostDTO;
import com.example.dto.QuizResponseDTO;

public class QuizMapper {
    public static Quiz toEntity(QuizPostDTO dto) {
        Quiz quiz = new Quiz();
        quiz.setTitlu(dto.getTitlu());
        quiz.setDescriere(dto.getDescriere());
        quiz.setCategorie(dto.getCategorie());
        return quiz;
    }

    public static QuizResponseDTO toDTO(Quiz quiz) {
        QuizResponseDTO dto = new QuizResponseDTO();
        dto.setId(quiz.getId());
        dto.setTitlu(quiz.getTitlu());
        dto.setDescriere(quiz.getDescriere());
        dto.setCategorie(quiz.getCategorie());

        dto.setIntrebari(quiz.getIntrebari().stream().map(QuestionMapper::toDTO).toList());

        return dto;
    }
}
