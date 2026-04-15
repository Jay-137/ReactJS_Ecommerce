package com.techstore.backend.dtos;

import java.time.LocalDateTime;
import java.util.List;

public record OrderDto(
  Long orderId,
  Double totalAmount,
  String status,
  LocalDateTime createdAt,
  List<OrderItemDto> items
) {
}
