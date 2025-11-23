package com.example.service;

import com.example.domain.UserActivity;
import com.example.repository.UserActivityRepository;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class ActivityService {
    private final UserActivityRepository activityRepository;

    public ActivityService(UserActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public void logActivity(Long userId, String activityType, String description, String icon) {
        UserActivity activity = new UserActivity(userId, activityType, description, icon);
        activityRepository.save(activity);
    }

    public List<UserActivity> getRecentActivities(Long userId, int limit) {
        return activityRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, limit));
    }
}
