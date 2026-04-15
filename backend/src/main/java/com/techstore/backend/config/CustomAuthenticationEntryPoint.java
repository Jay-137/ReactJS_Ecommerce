package com.techstore.backend.config;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.techstore.backend.dtos.ErrorResponseDto;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.databind.ObjectMapper;


@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint  {
  private final ObjectMapper objectMapper;
    public CustomAuthenticationEntryPoint(ObjectMapper objectMapper){
      this.objectMapper=objectMapper;
    }
  @Override
  public void commence(HttpServletRequest request,
                       HttpServletResponse response, 
                       AuthenticationException authException)
                                                              throws IOException{
    ErrorResponseDto error=new ErrorResponseDto(List.of("Unauthorised: Invalid or Expired JWT token"),HttpServletResponse.SC_UNAUTHORIZED,LocalDateTime.now());
    response.setContentType("application/json");
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    response.getWriter().write(objectMapper.writeValueAsString(error));
  }
}
