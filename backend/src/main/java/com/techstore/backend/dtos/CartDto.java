package com.techstore.backend.dtos;

import java.util.List;
public record CartDto(
  Long cartId,
  Long userId,
  List<CartItemDto> items
) {
}
