package com.techstore.backend.dtos;

import com.techstore.backend.models.Role;
public record UserDto(
  Long id,
  String name,
  String email,
  Role role
) {
}
