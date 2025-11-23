package com.example.exception;

public class NotFoundException extends RuntimeException {

    private final String resourceName;
    private final Object resourceId;

    public NotFoundException(String resourceName, Object resourceId) {
        super(String.format("%s with id %s was not found", resourceName, resourceId));
        this.resourceName = resourceName;
        this.resourceId = resourceId;
    }

    public NotFoundException(String message) {
        super(message);
        this.resourceName = null;
        this.resourceId = null;
    }

    public String getResourceName() {
        return resourceName;
    }

    public Object getResourceId() {
        return resourceId;
    }
}
