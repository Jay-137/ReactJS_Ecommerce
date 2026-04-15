package com.techstore.backend.exceptions;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import com.techstore.backend.dtos.ErrorResponseDto;


import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {
  
  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<ErrorResponseDto> handleRuntimeException(RuntimeException e){
    ErrorResponseDto error= new ErrorResponseDto(List.of(e.getMessage()),HttpStatus.BAD_REQUEST.value(),LocalDateTime.now());

    return new ResponseEntity<>(error,HttpStatus.BAD_REQUEST);
  }
  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ErrorResponseDto> handleDataIntegrityViolation(DataIntegrityViolationException e){
    String actualError = e.getMostSpecificCause().getMessage();
    ErrorResponseDto error= new ErrorResponseDto(List.of(actualError),HttpStatus.CONFLICT.value(),LocalDateTime.now());

    return new ResponseEntity<>(error,HttpStatus.CONFLICT);
  }
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponseDto> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex){
      List<String>errorMessages=ex.getBindingResult().getFieldErrors().stream().map(err->err.getField()+" : "+err.getDefaultMessage()).collect(Collectors.toList());
      ErrorResponseDto error=new ErrorResponseDto(errorMessages, HttpStatus.BAD_REQUEST.value(), LocalDateTime.now());

      return ResponseEntity.badRequest().body(error);
  }
  //throwed when we already know what the status is like unauthorised such as viewing others orders
  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<ErrorResponseDto> handleResponseStatuResponseException(ResponseStatusException e){
    ErrorResponseDto error=new ErrorResponseDto(List.of(e.getReason()), e.getStatusCode().value(), LocalDateTime.now());
    return new ResponseEntity<>(error,e.getStatusCode());
  }

  @ExceptionHandler(NoResourceFoundException.class)
  public ResponseEntity<ErrorResponseDto> handleNoResourcFoundException(NoResourceFoundException e){
    ErrorResponseDto error=new ErrorResponseDto(List.of("No Path found: "+e.getResourcePath()), e.getStatusCode().value(), LocalDateTime.now());
    return new ResponseEntity<>(error,e.getStatusCode());
  }
  @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
  public ResponseEntity<ErrorResponseDto> handleMethodNotSupportedException(HttpRequestMethodNotSupportedException e){
    ErrorResponseDto error=new ErrorResponseDto(List.of("Method '" + e.getMethod() + "' is not supported here. Supported methods: " + e.getSupportedHttpMethods()), e.getStatusCode().value(), LocalDateTime.now());
    return new ResponseEntity<>(error,e.getStatusCode());
  }
}
