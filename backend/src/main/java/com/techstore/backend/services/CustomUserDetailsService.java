package com.techstore.backend.services;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.techstore.backend.config.CustomUserDetails;
import com.techstore.backend.models.User;
import com.techstore.backend.repositories.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {
  private final UserRepository userRepository;
  public CustomUserDetailsService(UserRepository userRepository){
    this.userRepository=userRepository;
  }
  @Override
  public CustomUserDetails loadUserByUsername(String email){
    User user=userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("No User found with email: "+email));
    return new CustomUserDetails(user);
  }
}
