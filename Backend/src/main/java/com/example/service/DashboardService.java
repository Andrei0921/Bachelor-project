package com.example.service;

import com.example.dto.DashboardDTO;

public interface DashboardService {
    DashboardDTO getDashboard(Long userId);
}
