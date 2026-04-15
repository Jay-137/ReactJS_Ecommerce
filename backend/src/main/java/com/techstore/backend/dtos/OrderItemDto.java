package com.techstore.backend.dtos;

public record OrderItemDto(
        Long productId,
        String productName,
        Double priceAtPurchase,
        Integer quantity
) {
  
}
