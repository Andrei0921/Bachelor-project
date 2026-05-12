package com.example.service.impl;

import com.example.domain.Lesson;
import com.example.domain.validator.LessonValidator;
import com.example.dto.LessonDTO;
import com.example.exception.NotFoundException;
import com.example.mapper.LessonMapper;
import com.example.repository.LessonRepository;
import com.example.service.LessonService;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;
    private final LessonValidator lessonValidator;

    public LessonServiceImpl(LessonRepository lessonRepository, LessonValidator lessonValidator)
    {
        this.lessonRepository = lessonRepository;
        this.lessonValidator = lessonValidator;
    }

    @Override
    @Transactional
    public LessonDTO addLesson(LessonDTO lesson, MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            String imageUrl = saveLessonImage(image);
            lesson.setImagineUrls(imageUrl);
        }

        Lesson entity = LessonMapper.toEntity(lesson);
        lessonValidator.validate(entity);
        Lesson saved = lessonRepository.save(entity);
        return LessonMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public LessonDTO updateLesson(LessonDTO lesson, MultipartFile image) {
        Lesson existing =
                lessonRepository.findById(lesson.getId()).orElseThrow(() -> new NotFoundException("Lesson Not Found"));
        if (image != null && !image.isEmpty()) {
            String imageUrl = saveLessonImage(image);
            lesson.setImagineUrls(imageUrl);
        } else {
            lesson.setImagineUrls(existing.getImagineUrls());
        }

        Lesson entity = LessonMapper.toEntity(lesson);
        entity.setId(existing.getId());
        lessonValidator.validate(entity);
        Lesson saved = lessonRepository.save(entity);
        return LessonMapper.toDTO(saved);
    }

    private String saveLessonImage(MultipartFile image) {
        try {
            String uploadDir = "uploads/lessons/";
            String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Files.copy(image.getInputStream(), uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/lessons/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store image", e);
        }
    }

    @Override
    @Transactional
    public void deleteLesson(Long id) {
        if (lessonRepository.findById(id).isEmpty()) {
            throw new NotFoundException("Lesson Not Found");
        }
        lessonRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LessonDTO> getAllLessons() {
        List<LessonDTO> lessonDTOs = new ArrayList<>();
        for (Lesson lesson : lessonRepository.findAll()) {
            lessonDTOs.add(LessonMapper.toDTO(lesson));
        }
        return lessonDTOs;
    }

    @Override
    public LessonDTO getLessonById(Long id) {
        if (id == null) throw new IllegalArgumentException("Lesson id must not be null.");
        return LessonMapper.toDTO(lessonRepository
                .findById(id)
                .orElseThrow(() -> new NotFoundException("Lesson with id:" + id + " was not found")));
    }
}
