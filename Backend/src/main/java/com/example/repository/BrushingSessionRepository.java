package com.example.repository;

import com.example.domain.BrushingSession;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BrushingSessionRepository extends JpaRepository<BrushingSession, Long> {
    List<BrushingSession> findByUserIdOrderByStartedAtDesc(Long userId);

    Optional<BrushingSession> findTopByUserIdOrderByStartedAtDesc(Long userId);

    void deleteByUserId(Long userId);
}
