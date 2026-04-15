package com.techstore.backend.models;

import java.util.*;
import jakarta.persistence.*;
@Entity
public class Cart {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToMany(mappedBy = "cart",cascade = CascadeType.ALL,orphanRemoval = true)
  private List<CartItem>items=new ArrayList<>();

  @OneToOne
  @JoinColumn(name = "user_id")
  private User user;

  public Cart(){

  }
  public Cart(User user){
    this.user=user;
  }
  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }
  public List<CartItem> getItems() {
    return items;
  }
  public void setItems(List<CartItem> items) {
    this.items = items;
  }
  public User getUser() {
    return user;
  }
  public void setUser(User user) {
    this.user = user;
  }
  
}
