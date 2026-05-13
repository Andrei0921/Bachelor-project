package com.example.service.impl;

import com.example.domain.BrushingSession;
import com.example.domain.BrushingToothResult;
import com.example.domain.User;
import com.example.dto.BrushingPostDTO;
import com.example.dto.BrushingResponseDTO;
import com.example.dto.BrushingSessionDTO;
import com.example.dto.BrushingSessionPostDTO;
import com.example.dto.BrushingToothResultDTO;
import com.example.dto.BrushingTrainDTO;
import com.example.exception.AiServiceUnavailableException;
import com.example.exception.NotFoundException;
import com.example.mapper.BrushingMapper;
import com.example.repository.BrushingSessionRepository;
import com.example.repository.UserRepository;
import com.example.service.BrushingService;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class BrushingServiceImpl implements BrushingService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final BrushingSessionRepository brushingSessionRepository;
    private final UserRepository userRepository;

    public BrushingServiceImpl(BrushingSessionRepository brushingSessionRepository, UserRepository userRepository) {
        this.brushingSessionRepository = brushingSessionRepository;
        this.userRepository = userRepository;
    }

    @Value("${ai.base-url}")
    private String AI_URL;

    @Value("${training.csv-path:data/training_data.csv}")
    private String CSV_PATH;

    public BrushingResponseDTO evaluate(BrushingPostDTO request) {
        try {
            return restTemplate.postForObject(AI_URL + "/api/evaluations", request, BrushingResponseDTO.class);
        } catch (RestClientException e) {
            throw new AiServiceUnavailableException(
                    "Serviciul AI nu este disponibil. Porneste BrushingAI pe portul 5001 si incearca din nou.", e);
        }
    }

    @Override
    public void appendTrainingRows(List<BrushingTrainDTO> rows) {
        if (rows == null || rows.isEmpty()) return;
        try {

            synchronized (this) {
                Path csvPath = Paths.get(CSV_PATH);
                Path parent = csvPath.getParent();
                if (parent != null) {
                    Files.createDirectories(parent);
                }

                try (BufferedWriter w = Files.newBufferedWriter(
                        csvPath, StandardCharsets.UTF_8, StandardOpenOption.CREATE, StandardOpenOption.APPEND)) {
                    if (Files.size(csvPath) == 0) {
                        w.write("totalTime,avgSpeed,speedVariance,circularRatio,coverage,label");
                        w.newLine();
                    }

                    for (BrushingTrainDTO r : rows) {
                        String label = String.valueOf(computeLabel(r));
                        w.write(r.getTotalTime() + "," + r.getAvgSpeed()
                                + "," + r.getSpeedVariance()
                                + "," + r.getCircularRatio()
                                + "," + r.getCoverage()
                                + "," + label);
                        w.newLine();
                    }
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to append training rows to CSV: " + CSV_PATH, e);
        }
    }

    @Override
    @Transactional
    public BrushingSessionDTO saveSession(Long userId, BrushingSessionPostDTO request) {
        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new NotFoundException("User with id " + userId + " not found"));

        LocalDateTime endedAt = LocalDateTime.now();
        int duration = request.getDurationSeconds() == null ? 0 : Math.max(0, request.getDurationSeconds());

        BrushingSession session = new BrushingSession();
        session.setUser(user);
        session.setEndedAt(endedAt);
        session.setStartedAt(endedAt.minusSeconds(duration));
        session.setDurationSeconds(duration);

        List<BrushingToothResultDTO> requestResults =
                request.getToothResults() == null ? Collections.emptyList() : request.getToothResults();
        session.setOverallScore(computeOverallScore(requestResults));
        session.setOverallResult(computeOverallResult(session.getOverallScore()));

        for (BrushingToothResultDTO dto : requestResults) {
            BrushingToothResult toothResult = new BrushingToothResult();
            toothResult.setSession(session);
            toothResult.setToothName(dto.getToothName());
            toothResult.setTotalTime(dto.getTotalTime());
            toothResult.setAvgSpeed(dto.getAvgSpeed());
            toothResult.setSpeedVariance(dto.getSpeedVariance());
            toothResult.setCircularRatio(dto.getCircularRatio());
            toothResult.setCoverage(dto.getCoverage());
            toothResult.setResult(dto.getResult());
            toothResult.setAdviceText(toAdviceText(dto.getAdvice()));
            session.getToothResults().add(toothResult);
        }

        return BrushingMapper.toSessionDTO(brushingSessionRepository.save(session));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BrushingSessionDTO> getSessions(Long userId) {
        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new NotFoundException("User with id " + userId + " not found"));

        return brushingSessionRepository.findByUserIdOrderByStartedAtDesc(user.getId()).stream()
                .map(BrushingMapper::toSessionDTO)
                .toList();
    }

    private double clamp(double x) {
        return Math.max(0, Math.min(1, x));
    }

    private double scoreTime(double totalTime) {
        return clamp(totalTime / 5.0);
    }

    private double scoreCoverage(double coverage) {
        return clamp(coverage / 0.45);
    }

    private double scoreSpeed(double avgSpeed) {
        double diff = Math.abs(avgSpeed - 0.5);
        return clamp(1.0 - (diff / 0.2));
    }

    private double scoreVariance(double speedVar) {
        return clamp(1.0 - (speedVar / 0.2));
    }

    private double scoreCircular(double circularRatio) {

        return clamp(circularRatio / 0.5);
    }

    private int computeLabel(BrushingTrainDTO row) {
        double sTime = scoreTime(row.getTotalTime());
        double sCov = scoreCoverage(row.getCoverage());
        double sCirc = scoreCircular(row.getCircularRatio());
        double sSpd = scoreSpeed(row.getAvgSpeed());
        double sVar = scoreVariance(row.getSpeedVariance());

        double wTime = 0.25;
        double wCov = 0.35;
        double wCirc = 0.20;
        double wSpd = 0.10;
        double wVar = 0.10;

        double total = wTime * sTime + wCov * sCov + wCirc * sCirc + wSpd * sSpd + wVar * sVar;

        int label;
        if (total < 0.45) label = 0;
        else if (total < 0.75) label = 1;
        else label = 2;
        return label;
    }

    private int computeOverallScore(List<BrushingToothResultDTO> results) {
        if (results == null || results.isEmpty()) return 0;

        double total = 0;
        for (BrushingToothResultDTO result : results) {
            total += switch (String.valueOf(result.getResult())) {
                case "good" -> 100;
                case "ok" -> 60;
                case "poor" -> 25;
                default -> 0;};
        }

        return (int) Math.round(total / results.size());
    }

    private String computeOverallResult(Integer score) {
        if (score == null || score < 45) return "poor";
        if (score < 75) return "ok";
        return "good";
    }

    private String toAdviceText(List<String> advice) {
        if (advice == null || advice.isEmpty()) return "";
        return advice.stream().filter(a -> a != null && !a.isBlank()).collect(Collectors.joining("\n"));
    }
}
