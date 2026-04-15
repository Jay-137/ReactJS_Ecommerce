package com.techstore.backend.models;

import jakarta.persistence.*;

@Entity
public class OrderItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch =FetchType.LAZY)
  @JoinColumn(name = "order_id",nullable = false)
  private Order order;

  @Column(nullable = false)
  private Long productId;
  
  @Column(nullable = false)
  private String productName;

  @Column(nullable = false)
  private Double priceAtPurchase;

  @Column(nullable = false)
  private Integer quantity;

  public OrderItem(){
  }

  public OrderItem(Long productId, String productName, Double priceAtPurchase, Integer quantity) {
    this.productId = productId;
    this.productName = productName;
    this.priceAtPurchase = priceAtPurchase;
    this.quantity = quantity;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Order getOrder() {
    return order;
  }

  public void setOrder(Order order) {
    this.order = order;
  }

  public Long getProductId() {
    return productId;
  }

  public void setProductId(Long productId) {
    this.productId = productId;
  }

  public String getProductName() {
    return productName;
  }

  public void setProductName(String productName) {
    this.productName = productName;
  }

  public Double getPriceAtPurchase() {
    return priceAtPurchase;
  }

  public void setPriceAtPurchase(Double priceAtPurchase) {
    this.priceAtPurchase = priceAtPurchase;
  }

  public Integer getQuantity() {
    return quantity;
  }

  public void setQuantity(Integer quantity) {
    this.quantity = quantity;
  }

  
}