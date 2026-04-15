package com.techstore.backend.config;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.techstore.backend.services.JwtService;

import jakarta.annotation.Nonnull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFIlter extends OncePerRequestFilter {
  private final JwtService jwtService;
  public JwtAuthenticationFIlter(JwtService jwtService){
    this.jwtService=jwtService;
  }

  @Override
  protected void doFilterInternal(
                                  @Nonnull HttpServletRequest request, 
                                  @Nonnull HttpServletResponse response, 
                                  @Nonnull FilterChain filterChain)
                                  throws ServletException,IOException{
          final String authHeader=request.getHeader("Authorization");
          final String jwt;
          final String userEmail;
          final String role;

          if(authHeader==null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return;
          }
          jwt=authHeader.substring(7);
          userEmail=jwtService.extractMail(jwt);
          role=jwtService.extractRole(jwt);
          SimpleGrantedAuthority authority= new SimpleGrantedAuthority("ROLE_"+role);
          if(userEmail!=null && SecurityContextHolder.getContext().getAuthentication()==null){
            if(jwtService.isTokenValid(jwt, userEmail)){
              UsernamePasswordAuthenticationToken authToken=new UsernamePasswordAuthenticationToken(userEmail,null,Collections.singletonList(authority));
              SecurityContextHolder.getContext().setAuthentication(authToken);
            }
          }
          filterChain.doFilter(request, response);
  }
}
