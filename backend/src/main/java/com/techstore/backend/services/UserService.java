package com.techstore.backend.services;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.techstore.backend.models.User;
import com.techstore.backend.dtos.AuthResponseDto;
import com.techstore.backend.dtos.LoginRequestDto;
import com.techstore.backend.dtos.UserDto;
import com.techstore.backend.models.Cart;
import com.techstore.backend.repositories.UserRepository;

@Service
public class UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public UserService(UserRepository userRepository,PasswordEncoder passwordEncoder,JwtService jwtService){
    this.userRepository=userRepository;
    this.passwordEncoder=passwordEncoder;
    this.jwtService=jwtService;
  }

  public User registerUser(User user){
    if(userRepository.findByEmail(user.getEmail()).isPresent()){
      throw new RuntimeException("Email already exists");
    }
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    Cart cart=new Cart(user);
    user.setCart(cart);
    return userRepository.save(user);
  }

  public AuthResponseDto loginUser(@RequestBody LoginRequestDto loginRequestDto){
    User user=getUserByEmail(loginRequestDto.email());

    if(!passwordEncoder.matches(loginRequestDto.password(), user.getPassword())){
      throw new RuntimeException("Invalid email or password");
    }
    String token=jwtService.generateToken(user);
    UserDto userDto=new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole());
    return new AuthResponseDto(userDto,token);
  }

  public User getUserById(Long userId){
    User user=userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    return user;
  }
  public void deleteUser(Long userId){
    User user=getUserById(userId);
    userRepository.delete(user);
  }

  //added null check just in case
  public User getAuthenticatedUser() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
        throw new RuntimeException("User not authenticated");
    }

    return getUserByEmail(auth.getName());
 }
  public User getUserByEmail(String email){
    return userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("Invalid email or password"));
  }
}
