package com.example.mapper;

import com.example.domain.Lesson;
import com.example.dto.LessonDTO;

public class LessonMapper {
    public static LessonDTO toDTO(Lesson lesson) {
        return new LessonDTO(
                lesson.getId(),
                lesson.getTitlu(),
                lesson.getDescriere(),
                lesson.getContentText(),
                lesson.getCategorie(),
                lesson.getDurataMinute(),
                lesson.getImagineUrls());
    }

    public static Lesson toEntity(LessonDTO dto) {
        return new Lesson(
                dto.getId(),
                dto.getTitlu(),
                dto.getDescriere(),
                dto.getContentText(),
                dto.getCategorie(),
                dto.getDurataMinute(),
                dto.getImagineUrls());
    }
}
