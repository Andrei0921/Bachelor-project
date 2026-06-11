package com.example.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    private final ContentWebSocketHandler contentWebSocketHandler;

    public WebSocketConfig(ContentWebSocketHandler contentWebSocketHandler) {
        this.contentWebSocketHandler = contentWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(contentWebSocketHandler, "/ws").setAllowedOriginPatterns("*");
    }
}
