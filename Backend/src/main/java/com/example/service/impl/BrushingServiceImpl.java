package com.example.service.impl;

import com.example.dto.BrushingPostDTO;
import com.example.dto.BrushingResponseDTO;
import com.example.dto.BrushingTrainDTO;
import com.example.service.BrushingService;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class BrushingServiceImpl implements BrushingService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ai.base-url}")
    private String AI_URL;

    @Value("${training.csv-path:data/training_data.csv}")
    private String CSV_PATH;


    public BrushingResponseDTO evaluate(BrushingPostDTO request) {
        return restTemplate.postForObject(AI_URL+ "/api/evaluate", request, BrushingResponseDTO.class);
    }

    @Override
    public void appendTrainingRows(List<BrushingTrainDTO> rows) {
        if (rows == null || rows.isEmpty()) return;
        try {

            synchronized (this) {
                try (BufferedWriter w = Files.newBufferedWriter(
                        Paths.get(CSV_PATH),
                        StandardCharsets.UTF_8,
                        StandardOpenOption.CREATE,
                        StandardOpenOption.APPEND)) {
                    if (Files.size(Paths.get(CSV_PATH)) == 0) {
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
}
