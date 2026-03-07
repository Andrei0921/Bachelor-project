package com.example.service;

import com.example.dto.QuestionPostDTO;
import com.example.dto.QuestionResponseDTO;
import java.util.List;

public interface QuestionService {
    QuestionResponseDTO addQuizQuestion(Long quizId, QuestionPostDTO quizQuestion);

    QuestionResponseDTO updateQuizQuestion(Long id, QuestionPostDTO quizQuestion);

    void deleteQuizQuestion(Long quizQuestionId);

    List<QuestionResponseDTO> getQuestionsByQuiz(Long quizId);
}
