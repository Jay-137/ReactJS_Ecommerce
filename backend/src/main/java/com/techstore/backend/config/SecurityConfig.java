package com.techstore.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
  private final JwtAuthenticationFIlter jwtAuthFilter;
  private final CustomAccessDeniedHandler customAccessDeniedHandler;
  private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

  public SecurityConfig(JwtAuthenticationFIlter jwtAuthFilter,CustomAccessDeniedHandler customAccessDeniedHandler,CustomAuthenticationEntryPoint customAuthenticationEntryPoint){
    this.jwtAuthFilter=jwtAuthFilter;
    this.customAccessDeniedHandler=customAccessDeniedHandler;
    this.customAuthenticationEntryPoint=customAuthenticationEntryPoint;
  }

  @Bean
  public PasswordEncoder passwordEncoder(){
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
    http
        .csrf(csrf->csrf.disable())
        .cors(org.springframework.security.config.Customizer.withDefaults())
        .exceptionHandling(ex->ex.accessDeniedHandler(customAccessDeniedHandler)
                                 .authenticationEntryPoint(customAuthenticationEntryPoint)
      )                          
        .authorizeHttpRequests(auth->
          auth
              .requestMatchers("/api/users/register","/api/users/login").permitAll()
              .requestMatchers(org.springframework.http.HttpMethod.GET,"/api/products/**").permitAll()
              .requestMatchers("/uploads/**").permitAll()
              .requestMatchers("/api/webhook/stripe").permitAll()

              .requestMatchers("/api/products/**").hasRole("ADMIN")

              .requestMatchers("/api/cart/**").authenticated()
              .requestMatchers("/api/orders/**").authenticated()
              .anyRequest().authenticated()
        )
        .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .addFilterBefore(jwtAuthFilter,UsernamePasswordAuthenticationFilter.class);
        return http.build();
  }
}
