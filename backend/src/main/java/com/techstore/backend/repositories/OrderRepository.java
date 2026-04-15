package com.techstore.backend.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.techstore.backend.models.Order;

public interface OrderRepository extends JpaRepository<Order,Long>,JpaSpecificationExecutor<Order>  {
  Page<Order> findByUserId(Long userId,Pageable pageable); //we replace when specification is implemented
  Optional<Order> findByStripePaymentIntentId(String intentId);
}
