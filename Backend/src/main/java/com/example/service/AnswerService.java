package com.example.service;

import com.example.dto.AnswerPostDTO;
import com.example.dto.AnswerResponseDTO;
import java.util.List;

public interface AnswerService {
    AnswerResponseDTO addQuizAnswer(Long questionID, AnswerPostDTO quizAnswer);

    AnswerResponseDTO updateQuizAnswer(Long id, AnswerPostDTO quizAnswer);

    List<AnswerResponseDTO> getQuizAnswersByQuizQuestion(Long quizQuestionId);
}
