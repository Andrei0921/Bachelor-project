package com.example.service.impl;

import com.example.domain.*;
import com.example.domain.validator.AnswerValidator;
import com.example.domain.validator.QuestionValidator;
import com.example.domain.validator.QuizValidator;
import com.example.dto.*;
import com.example.exception.NotFoundException;
import com.example.exception.ValidationException;
import com.example.mapper.AnswerMapper;
import com.example.mapper.QuestionMapper;
import com.example.mapper.QuizMapper;
import com.example.mapper.QuizResultMapper;
import com.example.repository.*;
import com.example.service.AnswerService;
import com.example.service.QuestionService;
import com.example.service.QuizResultService;
import com.example.service.QuizService;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class QuizServiceImpl implements QuizService, AnswerService, QuizResultService, QuestionService {
    private final QuizRepository quizRepository;
    private final QuizAnswerRepository quizAnswerRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final QuizResultRepository quizResultRepository;
    private final UserRepository userRepository;
    private final QuizValidator quizValidator;
    private final QuestionValidator questionValidator;
    private final AnswerValidator answerValidator;

    public QuizServiceImpl(
            QuizRepository quizRepository,
            QuizAnswerRepository quizAnswerRepository,
            QuizQuestionRepository quizQuestionRepository,
            QuizResultRepository quizResultRepository,
            UserRepository userRepository,
            QuizValidator quizValidator,
            QuestionValidator questionValidator,
            AnswerValidator answerValidator) {
        this.quizRepository = quizRepository;
        this.quizAnswerRepository = quizAnswerRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.quizResultRepository = quizResultRepository;
        this.userRepository = userRepository;
        this.quizValidator = quizValidator;
        this.questionValidator = questionValidator;
        this.answerValidator = answerValidator;
    }

    @Override
    @Transactional
    public AnswerResponseDTO addQuizAnswer(Long questionId, AnswerPostDTO quizAnswerDto) {
        QuizQuestion question = quizQuestionRepository
                .findById(questionId)
                .orElseThrow(() -> new NotFoundException("Question not found"));
        QuizAnswer answer = AnswerMapper.toEntity(quizAnswerDto, question);
        answerValidator.validate(answer);
        QuizAnswer saved = quizAnswerRepository.save(answer);
        return AnswerMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public AnswerResponseDTO updateQuizAnswer(Long id, AnswerPostDTO quizAnswerDto) {
        QuizAnswer answer =
                quizAnswerRepository.findById(id).orElseThrow(() -> new NotFoundException("Answer not found"));
        answer.setText(quizAnswerDto.getText());
        answer.setCorrect(quizAnswerDto.isCorrect());
        answerValidator.validate(answer);
        QuizAnswer saved = quizAnswerRepository.save(answer);
        return AnswerMapper.toDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnswerResponseDTO> getQuizAnswersByQuizQuestion(Long quizQuestionId) {
        List<QuizAnswer> answers = quizAnswerRepository.findByQuestionId(quizQuestionId);
        return answers.stream().map(AnswerMapper::toDTO).toList();
    }

    @Override
    @Transactional
    public QuestionResponseDTO addQuizQuestion(Long quizId, QuestionPostDTO quizQuestionDto) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(() -> new NotFoundException("Quiz not found"));
        QuizQuestion question = QuestionMapper.toEntity(quizQuestionDto, quiz);
        questionValidator.validate(question);
        QuizQuestion saved = quizQuestionRepository.save(question);
        return QuestionMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public QuestionResponseDTO updateQuizQuestion(Long id, QuestionPostDTO quizQuestionDto) {
        QuizQuestion question =
                quizQuestionRepository.findById(id).orElseThrow(() -> new NotFoundException("Question not found"));
        question.setIntrebare(quizQuestionDto.getIntrebare());
        questionValidator.validate(question);
        QuizQuestion saved = quizQuestionRepository.save(question);
        return QuestionMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public void deleteQuizQuestion(Long questionId) {
        if (quizQuestionRepository.findById(questionId).isEmpty()) {
            throw new NotFoundException("Question not found");
        }
        quizQuestionRepository.deleteById(questionId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuestionResponseDTO> getQuestionsByQuiz(Long quizId) {
        List<QuizQuestion> questions = quizQuestionRepository.findByQuizId(quizId);
        return questions.stream().map(QuestionMapper::toDTO).toList();
    }

    @Override
    @Transactional
    public QuizResultDTO addQuizResult(QuizResultDTO quizResultDto) {
        User user = userRepository
                .findById(quizResultDto.getUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        Quiz quiz = quizRepository
                .findById(quizResultDto.getQuizId())
                .orElseThrow(() -> new NotFoundException("Quiz not found"));
        QuizResult result = QuizResultMapper.toEntity(quizResultDto, user, quiz);
        QuizResult saved = quizResultRepository.save(result);
        return QuizResultMapper.toDTO(saved);
    }

    @Override
    public QuizResultDTO getBestQuizResult(Long id, Long quizId) {
        return quizResultRepository
                .findTopByUserIdAndQuizIdOrderByScorDesc(id, quizId)
                .map(QuizResultMapper::toDTO)
                .orElse(null);
    }

    @Override
    public QuizResultDTO getQuizResultByUserId(Long id) {
        QuizResult result = quizResultRepository
                .findFirstByUserId(id)
                .orElseThrow(() -> new NotFoundException("Result not found for user"));
        return QuizResultMapper.toDTO(result);
    }

    @Override
    @Transactional
    public QuizResultDTO submitQuiz(QuizSubmitDTO dto) {
        Quiz quiz = quizRepository.findById(dto.getQuizId()).orElseThrow(() -> new NotFoundException("Quiz not found"));

        User user = userRepository.findById(dto.getUserId()).orElseThrow(() -> new NotFoundException("User not found"));

        int score = calculateScore(quiz, dto);

        QuizResult result = new QuizResult();
        result.setQuiz(quiz);
        result.setUser(user);
        result.setScor(score);
        QuizResult saved = quizResultRepository.save(result);

        return QuizResultMapper.toDTO(saved);
    }

    private int calculateScore(Quiz quiz, QuizSubmitDTO dto) {
        Map<Long, Long> selected = dto.getAnswers().stream()
                .collect(Collectors.toMap(QuizSelectionDTO::getQuestionId, QuizSelectionDTO::getAnswerId));

        int score = 0;

        for (QuizQuestion q : quiz.getIntrebari()) {
            Long selectedAnswer = selected.get(q.getId());
            if (selectedAnswer == null) continue;

            boolean correct = q.getAnswers().stream().anyMatch(a -> a.getId().equals(selectedAnswer) && a.isCorrect());

            if (correct) score++;
        }

        return score;
    }

    @Override
    @Transactional
    public QuizResponseDTO addQuiz(QuizPostDTO quizDto) {
        Quiz quiz = QuizMapper.toEntity(quizDto);
        quizValidator.validate(quiz);
        Quiz saved = quizRepository.save(quiz);
        return QuizMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public QuizResponseDTO updateQuiz(Long id, QuizPostDTO quizDto) {
        Quiz quiz = quizRepository
                .findById(id)
                .orElseThrow(() -> new NotFoundException("Quiz with id " + id + " not found"));
        quiz.setTitlu(quizDto.getTitlu());
        quiz.setDescriere(quizDto.getDescriere());
        quiz.setCategorie(quizDto.getCategorie());
        quizValidator.validate(quiz);
        Quiz saved = quizRepository.save(quiz);
        return QuizMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public void deleteQuiz(Long quizId) {
        if (quizRepository.findById(quizId).isEmpty()) {
            throw new NotFoundException("Quiz not found");
        }
        quizRepository.deleteById(quizId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuizResponseDTO> getAllQuizzes() {
        return quizRepository.findAll().stream().map(QuizMapper::toDTO).toList();
    }

    @Override
    public QuizResponseDTO getQuizById(Long id) {
        Quiz quiz = quizRepository
                .findById(id)
                .orElseThrow(() -> new NotFoundException("Quiz with id " + id + " not found"));
        return QuizMapper.toDTO(quiz);
    }

    @Override
    public List<QuizResponseDTO> getQuizzesByCategorie(String categorie) {
        if (categorie == null || categorie.isBlank()) {
            throw new ValidationException("Category is required");
        }

        return quizRepository.findByCategorieIgnoreCase(categorie).stream()
                .map(QuizMapper::toDTO)
                .toList();
    }

    @Override
    public List<String> getCategories() {
        return quizRepository.findDistinctCategories();
    }
}
