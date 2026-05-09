package com.example.controller;

import com.example.controller.problem.LessonApiErrorResponses;
import com.example.controller.problem.QuizApiErrorResponses;
import com.example.dto.LessonDTO;
import com.example.service.LessonService;
import java.util.List;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/lessons")
@LessonApiErrorResponses
public class LessonController {
    private static final Logger logger = LoggerFactory.getLogger(LessonController.class);
    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LessonDTO> createLesson(
            @RequestPart("lesson") LessonDTO dto, @RequestPart(value = "image", required = false) MultipartFile image) {
        logger.info("Creating lesson (multipart): {}", dto);
        LessonDTO saved = lessonService.addLesson(dto, image);
        return ResponseEntity.ok(saved);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LessonDTO> updateLesson(
            @PathVariable Long id,
            @RequestPart("lesson") LessonDTO dto,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        logger.info("Updating lesson (multipart) id={}", id);
        dto.setId(id);
        LessonDTO saved = lessonService.updateLesson(dto, image);
        return ResponseEntity.ok(saved);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LessonDTO> getLessonById(@PathVariable Long id) {
        logger.debug("Fetching lesson with id {}", id);
        LessonDTO lesson = lessonService.getLessonById(id);
        return ResponseEntity.ok(lesson);
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<LessonDTO>> getAllLessons() {
        logger.debug("Fetching all lessons");
        List<LessonDTO> lessonDTOS = StreamSupport.stream(
                        lessonService.getAllLessons().spliterator(), false)
                .toList();
        return ResponseEntity.ok(lessonDTOS);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id) {
        logger.warn("Deleting lesson with id {}", id);
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }
}
