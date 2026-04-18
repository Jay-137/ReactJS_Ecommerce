package com.techstore.backend.config;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.techstore.backend.models.Role;
import com.techstore.backend.models.User;

public class CustomUserDetails implements UserDetails {
  private Long id;
  private String name;
  private String email;
  private Role role;
  private String password;
  public CustomUserDetails(User user){
    this.id=user.getId();
    this.name=user.getName();
    this.email=user.getEmail();
    this.password=user.getPassword();
    this.role=user.getRole();
  }
  public Long getId() {
    return id;
  }
  public String getName() {
    return name;
  }
  @Override
  public String getUsername(){
    return email;
  }
  @Override
  public String getPassword(){
    return password;
  }
  @Override
  public Collection<? extends GrantedAuthority> getAuthorities(){
    return List.of(new SimpleGrantedAuthority("ROLE_"+role));
  }
}
