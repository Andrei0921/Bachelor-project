package com.example.websocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class ContentWebSocketHandler extends TextWebSocketHandler {
    private static final Logger logger = LoggerFactory.getLogger(ContentWebSocketHandler.class);

    private final ObjectMapper objectMapper;
    private final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();

    public ContentWebSocketHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
        logger.info("WebSocket client connected: {}", session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
        logger.info("WebSocket client disconnected: {} ({})", session.getId(), status);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        sessions.remove(session);
        if (session.isOpen()) {
            session.close(CloseStatus.SERVER_ERROR);
        }
    }

    public void broadcast(ContentEvent event) {
        logger.info(
                "Broadcasting WebSocket event resource={}, action={}, clients={}",
                event.resource(),
                event.action(),
                sessions.size());

        final TextMessage message;
        try {
            message = new TextMessage(objectMapper.writeValueAsString(event));
        } catch (JsonProcessingException exception) {
            logger.error("Could not serialize content WebSocket event", exception);
            return;
        }

        sessions.removeIf(session -> !send(session, message));
    }

    private boolean send(WebSocketSession session, TextMessage message) {
        if (!session.isOpen()) {
            return false;
        }

        try {
            synchronized (session) {
                session.sendMessage(message);
            }
            return true;
        } catch (IOException exception) {
            logger.debug("Removing unavailable WebSocket session {}", session.getId(), exception);
            return false;
        }
    }
}
