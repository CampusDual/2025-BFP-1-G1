package com.campusdual.bfp.exception;

public class RegistrationException extends RuntimeException {
    private final String field;
    private final String errorCode;

    public RegistrationException(String field, String errorCode, String message) {
        super(message);
        this.field = field;
        this.errorCode = errorCode;
    }

    public String getField() {
        return field;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
