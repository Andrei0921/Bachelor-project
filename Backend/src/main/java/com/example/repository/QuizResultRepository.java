package com.example.repository;

import com.example.domain.QuizResult;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    Optional<QuizResult> findTopByUserIdOrderByIdDesc(Long userId);

    Optional<QuizResult> findFirstByUserId(Long userId);
}
