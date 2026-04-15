package com.techstore.backend.config;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import com.techstore.backend.dtos.ErrorResponseDto;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.databind.ObjectMapper;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;
    public CustomAccessDeniedHandler(ObjectMapper objectMapper){
      this.objectMapper=objectMapper;
    }
    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException
    ) throws IOException{

      ErrorResponseDto error=new ErrorResponseDto(List.of("Forbidden: You don't have permission"), HttpServletResponse.SC_FORBIDDEN, LocalDateTime.now());
      response.setContentType("application/json");
      response.setStatus(HttpServletResponse.SC_FORBIDDEN);
      response.getWriter().write(objectMapper.writeValueAsString(error));
    }
  
}
