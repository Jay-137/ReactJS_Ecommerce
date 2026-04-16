package com.techstore.backend.dtos;

public record ProductDto(
  Long id,
  String name,
  String description,
  Double price,
  String imageUrl,
  String brand,
  String category,
  Boolean featured
) {}
