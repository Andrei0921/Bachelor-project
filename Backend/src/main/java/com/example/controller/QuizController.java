package com.example.controller;

import com.example.controller.problem.QuizApiErrorResponses;
import com.example.dto.*;
import com.example.service.AnswerService;
import com.example.service.QuestionService;
import com.example.service.QuizResultService;
import com.example.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quizzes")
@QuizApiErrorResponses
public class QuizController {
    private static final Logger logger = LoggerFactory.getLogger(QuizController.class);
    private final QuizService quizService;
    private final AnswerService answerService;
    private final QuestionService questionService;
    private final QuizResultService quizResultService;

    public QuizController(
            QuizService quizService,
            AnswerService answerService,
            QuestionService questionService,
            QuizResultService quizResultService) {
        this.quizService = quizService;
        this.answerService = answerService;
        this.questionService = questionService;
        this.quizResultService = quizResultService;
    }

    @Operation(summary = "Create a new Quiz")
    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuizResponseDTO> addQuiz(@RequestBody QuizPostDTO dto) {
        logger.info("Creating quiz: {}", dto);
        return ResponseEntity.ok(quizService.addQuiz(dto));
    }

    @Operation(summary = "Update an existing Quiz")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuizResponseDTO> updateQuiz(@PathVariable Long id, @RequestBody QuizPostDTO dto) {
        logger.info("Updating quiz with id {}", id);
        return ResponseEntity.ok(quizService.updateQuiz(id, dto));
    }

    @Operation(summary = "Delete a Quiz")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        logger.info("Deleting Lesson with id {}", id);
        quizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get all Quizzes")
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<QuizResponseDTO>> getAllQuizzes() {
        logger.debug("Fetching all quizzes");
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }

    @Operation(summary = "Get Quiz by ID")
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<QuizResponseDTO> getQuizById(@PathVariable Long id) {
        logger.debug("Fetching quiz by ID {}", id);
        return ResponseEntity.ok(quizService.getQuizById(id));
    }

    @PostMapping(value = "/{quizId}/questions", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuestionResponseDTO> addQuestion(
            @PathVariable Long quizId, @RequestBody QuestionPostDTO dto) {
        logger.info("Creating question: {}", dto);
        return ResponseEntity.ok(questionService.addQuizQuestion(quizId, dto));
    }

    @PutMapping(value = "/questions/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuestionResponseDTO> updateQuestion(@PathVariable Long id, @RequestBody QuestionPostDTO dto) {
        logger.info("Updating Response with id {}", id);
        return ResponseEntity.ok(questionService.updateQuizQuestion(id, dto));
    }

    @DeleteMapping("/questions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        logger.info("Deleting question with id {}", id);
        questionService.deleteQuizQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "/{quizId}/questions", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<QuestionResponseDTO>> getByQuiz(@PathVariable Long quizId) {
        logger.debug("Fetching questions by quiz ID {}", quizId);
        return ResponseEntity.ok(questionService.getQuestionsByQuiz(quizId));
    }

    @PostMapping(value = "/{questionId}/answers", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnswerResponseDTO> addAnswer(@PathVariable Long questionId, @RequestBody AnswerPostDTO dto) {
        logger.info("Creating answer: {}", dto);
        return ResponseEntity.ok(answerService.addQuizAnswer(questionId, dto));
    }

    @PutMapping("/answers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnswerResponseDTO> updateAnswer(@PathVariable Long id, @RequestBody AnswerPostDTO dto) {
        logger.info("Updating Answer with id {}", id);
        return ResponseEntity.ok(answerService.updateQuizAnswer(id, dto));
    }

    @GetMapping(value = "/questions/{questionId}/answers", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<AnswerResponseDTO>> getAnswers(@PathVariable Long questionId) {
        logger.debug("Fetching answers for question {}", questionId);
        return ResponseEntity.ok(answerService.getQuizAnswersByQuizQuestion(questionId));
    }

    @PostMapping(value = "/results", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<QuizResultDTO> addResult(@RequestBody QuizResultDTO dto) {
        logger.info("Creating result: {}", dto);
        return ResponseEntity.ok(quizResultService.addQuizResult(dto));
    }

    @GetMapping(value = "/results/last/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<QuizResultDTO> getLastResult(@PathVariable Long userId) {
        logger.debug("Fetching last quiz result for user {}", userId);
        return ResponseEntity.ok(quizResultService.getLastQuizResult(userId));
    }

    @GetMapping(value = "/results/by-user/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<QuizResultDTO> getByUser(@PathVariable Long userId) {
        logger.debug("Fetching results by user {}", userId);
        return ResponseEntity.ok(quizResultService.getQuizResultByUserId(userId));
    }
}
