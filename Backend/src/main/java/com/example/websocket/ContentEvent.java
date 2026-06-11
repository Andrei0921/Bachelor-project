package com.example.websocket;

public record ContentEvent(String resource, String action, Long id) {}
