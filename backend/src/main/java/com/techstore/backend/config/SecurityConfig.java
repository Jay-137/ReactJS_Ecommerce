package com.techstore.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.techstore.backend.services.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
  private final JwtAuthenticationFilter jwtAuthFilter;
  private final CustomAccessDeniedHandler customAccessDeniedHandler;
  private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
  private final CustomUserDetailsService customUserDetailsService;

  public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter,CustomAccessDeniedHandler customAccessDeniedHandler,CustomAuthenticationEntryPoint customAuthenticationEntryPoint,CustomUserDetailsService customUserDetailsService){
    this.jwtAuthFilter=jwtAuthFilter;
    this.customAccessDeniedHandler=customAccessDeniedHandler;
    this.customAuthenticationEntryPoint=customAuthenticationEntryPoint;
    this.customUserDetailsService=customUserDetailsService;
  }

  @Bean
  public PasswordEncoder passwordEncoder(){
    return new BCryptPasswordEncoder();
  }

  //adding spring username & password validation 
  //created daopauthprovder for usernamepassauthtoken support
  @Bean
  public DaoAuthenticationProvider authenticationProvider(){
    DaoAuthenticationProvider provider=new DaoAuthenticationProvider(customUserDetailsService);
    provider.setPasswordEncoder(passwordEncoder());
    return provider;
  }
  //added our auth manager who manages all auth providers such as daoauthprovider
  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config){
    return config.getAuthenticationManager();
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
        .authenticationProvider(authenticationProvider())//added our daoprovider to authproviders
        .sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .addFilterBefore(jwtAuthFilter,UsernamePasswordAuthenticationFilter.class);
        return http.build();
  }
}
