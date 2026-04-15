package com.techstore.backend.dtos;

public record AuthResponseDto(
  UserDto user,
  String token
) {
}
