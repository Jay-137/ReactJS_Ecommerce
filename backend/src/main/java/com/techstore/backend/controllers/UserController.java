package com.techstore.backend.controllers;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.techstore.backend.dtos.AuthResponseDto;
import com.techstore.backend.dtos.LoginRequestDto;
import com.techstore.backend.dtos.UserDto;
import com.techstore.backend.models.User;
import com.techstore.backend.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {
  private final UserService userService;
  public UserController(UserService userService){
    this.userService=userService;
  }

  @PostMapping("/register")
  public UserDto registerUser(@Valid @RequestBody User incomingUser){
    User savedUser=userService.registerUser(incomingUser);
    return new UserDto(savedUser.getId(),savedUser.getName(), savedUser.getEmail(), savedUser.getRole());
  }
  @PostMapping("/login")
  public AuthResponseDto loginUser(@Valid @RequestBody LoginRequestDto loginRequestDto){
    return userService.loginUser(loginRequestDto);
  }
  @GetMapping
  public UserDto getUser(){
    // throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to view this order.");
    User user=userService.getAuthenticatedUser();
    return new UserDto(user.getId(),user.getName(),user.getEmail(),user.getRole());
  }
  @DeleteMapping()
    public void deleteAccount() {
        User user=userService.getAuthenticatedUser();
        userService.deleteUser(user.getId());
    }
}
