package com.example.service.impl;

import com.example.domain.Quiz;
import com.example.domain.QuizResult;
import com.example.dto.DashboardDTO;
import com.example.mapper.BrushingMapper;
import com.example.repository.BrushingSessionRepository;
import com.example.repository.LessonRepository;
import com.example.repository.QuizRepository;
import com.example.repository.QuizResultRepository;
import com.example.service.DashboardService;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardServiceImpl implements DashboardService {
    private final BrushingSessionRepository brushingSessionRepository;
    private final QuizResultRepository quizResultRepository;
    private final QuizRepository quizRepository;
    private final LessonRepository lessonRepository;

    public DashboardServiceImpl(
            BrushingSessionRepository brushingSessionRepository,
            QuizResultRepository quizResultRepository,
            QuizRepository quizRepository,
            LessonRepository lessonRepository) {
        this.brushingSessionRepository = brushingSessionRepository;
        this.quizResultRepository = quizResultRepository;
        this.quizRepository = quizRepository;
        this.lessonRepository = lessonRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardDTO getDashboard(Long userId) {
        DashboardDTO dashboard = new DashboardDTO();
        dashboard.setLatestBrushing(brushingSessionRepository
                .findTopByUserIdOrderByStartedAtDesc(userId)
                .map(BrushingMapper::toSessionDTO)
                .orElse(null));
        dashboard.setQuizzesWithoutMaxScore(countAttemptedQuizzesWithoutMaxScore(userId));
        dashboard.setLessonCount(lessonRepository.count());
        return dashboard;
    }

    private long countAttemptedQuizzesWithoutMaxScore(Long userId) {
        Map<Long, QuizResult> bestResultByQuizId = new HashMap<>();

        for (QuizResult result : quizResultRepository.findByUserId(userId)) {
            if (result.getQuiz() == null || result.getQuiz().getId() == null) continue;

            Long quizId = result.getQuiz().getId();
            QuizResult currentBest = bestResultByQuizId.get(quizId);
            if (currentBest == null || safeScore(result) > safeScore(currentBest)) {
                bestResultByQuizId.put(quizId, result);
            }
        }

        return quizRepository.findAll().stream()
                .filter(quiz -> !hasMaxScore(quiz, bestResultByQuizId.get(quiz.getId())))
                .count();
    }

    private boolean hasMaxScore(Quiz quiz, QuizResult result) {
        if (result == null) return false;
        return safeScore(result) >= quiz.getIntrebari().size();
    }

    private int safeScore(QuizResult result) {
        return result.getScor() == null ? 0 : result.getScor();
    }
}
