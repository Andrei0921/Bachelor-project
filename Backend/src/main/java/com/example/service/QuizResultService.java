package com.example.service;

import com.example.dto.QuizResultDTO;

public interface QuizResultService {
    QuizResultDTO addQuizResult(QuizResultDTO quizResult);

    QuizResultDTO getLastQuizResult(Long id);

    QuizResultDTO getQuizResultByUserId(Long id);
}
