package com.techstore.backend.dtos;

public record CartRequestDto(
  Long productId,
  Integer quantity
) {
}
