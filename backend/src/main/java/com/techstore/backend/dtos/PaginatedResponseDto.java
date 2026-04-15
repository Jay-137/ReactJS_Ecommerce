package com.techstore.backend.dtos;

import java.util.List;

public record PaginatedResponseDto<T>(
  List<T> content,
  int pageNo,
  int pageSize,
  long totalElements,
  int totalPages,
  boolean isLast
) {
  
}
