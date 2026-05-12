package com.example.repository;

import com.example.domain.QuizResult;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    Optional<QuizResult> findTopByUserIdAndQuizIdOrderByScorDesc(Long userId, Long quizId);

    Optional<QuizResult> findFirstByUserId(Long userId);

    void deleteByUserId(Long userId);
}
