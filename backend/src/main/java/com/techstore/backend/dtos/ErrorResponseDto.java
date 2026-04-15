package com.techstore.backend.dtos;

import java.time.LocalDateTime;
import java.util.List;

public record ErrorResponseDto(
  List<String> message,
  int status,
  LocalDateTime timestamp
) {
}
