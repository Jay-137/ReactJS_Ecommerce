package com.techstore.backend.services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.techstore.backend.models.User;
import com.techstore.backend.config.CustomUserDetails;
import com.techstore.backend.dtos.AuthResponseDto;
import com.techstore.backend.dtos.LoginRequestDto;
import com.techstore.backend.dtos.UserDto;
import com.techstore.backend.models.Cart;
import com.techstore.backend.models.Role;
import com.techstore.backend.repositories.UserRepository;

@Service
public class UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authManager;//added authmanager

  public UserService(UserRepository userRepository,PasswordEncoder passwordEncoder,JwtService jwtService,AuthenticationManager authManager){
    this.userRepository=userRepository;
    this.passwordEncoder=passwordEncoder;
    this.jwtService=jwtService;
    this.authManager=authManager;
  }

  public User registerUser(User user){
    if(userRepository.findByEmail(user.getEmail()).isPresent()){
      throw new RuntimeException("Email already exists");
    }
    if (user.getRole() == null) {
        user.setRole(Role.USER); // Replace with whatever your Enum value is
    }
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    Cart cart=new Cart(user);
    user.setCart(cart);
    return userRepository.save(user);
  }

  public AuthResponseDto loginUser(LoginRequestDto loginRequestDto){
    Authentication authentication=authManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequestDto.email(), loginRequestDto.password()));
    Object principal = authentication.getPrincipal();
    CustomUserDetails userDetails = (CustomUserDetails) principal;
    // use it safely
    String token=jwtService.generateToken(userDetails);
    String roleStr=jwtService.extractRole(token);
    Role role=Role.valueOf(roleStr);
    UserDto userDto=new UserDto(userDetails.getId(), userDetails.getName(), userDetails.getUsername(),role );
    return new AuthResponseDto(userDto,token);
    // User user=getUserByEmail(loginRequestDto.email());
    // if(!passwordEncoder.matches(loginRequestDto.password(), user.getPassword())){
    //   throw new RuntimeException("Invalid email or password");
    // }
    // String token=jwtService.generateToken(user);
    // UserDto userDto=new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole());
    // return new AuthResponseDto(userDto,token);
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
