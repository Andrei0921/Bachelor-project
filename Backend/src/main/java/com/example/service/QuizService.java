package com.example.service;

import com.example.dto.QuizPostDTO;
import com.example.dto.QuizResponseDTO;
import java.util.List;

public interface QuizService {

    QuizResponseDTO addQuiz(QuizPostDTO quiz);

    QuizResponseDTO updateQuiz(Long id, QuizPostDTO quiz);

    void deleteQuiz(Long quizId);

    List<QuizResponseDTO> getAllQuizzes();

    List<QuizResponseDTO> getQuizzesByCategorie(String categorie);

    List<String> getCategories();

    QuizResponseDTO getQuizById(Long id);
}
