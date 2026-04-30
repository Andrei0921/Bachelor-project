package com.example.service;

import com.example.dto.QuizResultDTO;
import com.example.dto.QuizSubmitDTO;

public interface QuizResultService {
    QuizResultDTO addQuizResult(QuizResultDTO quizResult);

    QuizResultDTO getBestQuizResult(Long id, Long quizId);

    QuizResultDTO getQuizResultByUserId(Long id);

    QuizResultDTO submitQuiz(QuizSubmitDTO quizSubmitDTO);
}
