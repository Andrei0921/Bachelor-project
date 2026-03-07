package com.example.service;

import com.example.dto.LessonDTO;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface LessonService {
    LessonDTO addLesson(LessonDTO lesson, MultipartFile image);

    LessonDTO updateLesson(LessonDTO lesson, MultipartFile image);

    void deleteLesson(Long id);

    List<LessonDTO> getAllLessons();

    LessonDTO getLessonById(Long id);
}
