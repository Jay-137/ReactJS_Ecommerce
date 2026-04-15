package com.techstore.backend.dtos;

public record CartItemDto(
Long productId,
String productName,
Double price,
Integer quantity
) {
}
