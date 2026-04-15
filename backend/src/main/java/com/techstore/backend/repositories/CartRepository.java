package com.techstore.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.techstore.backend.models.Cart;

public interface CartRepository extends JpaRepository<Cart,Long> {
  
}
