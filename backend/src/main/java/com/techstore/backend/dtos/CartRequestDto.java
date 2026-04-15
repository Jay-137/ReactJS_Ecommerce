package com.techstore.backend.dtos;

public record CartRequestDto(
  Long userId,
  Long productid,
  Integer quantity
) {
}
