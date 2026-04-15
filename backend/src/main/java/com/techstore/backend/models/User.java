package com.techstore.backend.models;

import java.util.List;
import java.util.ArrayList;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;;

@Entity
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank(message="Name cannot be empty")
  private String name;
  @Column(nullable = false,unique = true)
  @NotBlank(message="Email cannot be empty")
  @Email(message="Email must be valid address")
  private String email;
  @NotBlank(message="Password cannot be empty")
  private String password;

  @Enumerated(EnumType.STRING)
  @NotNull(message="Role cannot be empty")
  private Role role;


  @OneToOne(mappedBy = "user",cascade = CascadeType.ALL)
  private Cart cart;

  @OneToMany(mappedBy = "user",cascade = CascadeType.ALL)
  private List<Order>orders=new ArrayList<>();

  public User(){

  }
  public User(Long id,String name,String password,String email,Role role){
    this.id=id;
    this.name=name;
    this.password=password;
    this.email=email;
    this.role=role;
  }

  public Cart getCart() {
    return cart;
  }
  public void setCart(Cart cart) {
    this.cart = cart;
  }
  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }
  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }
  public String getEmail() {
    return email;
  }
  public void setEmail(String email) {
    this.email = email;
  }
  public String getPassword() {
    return password;
  }
  public void setPassword(String password) {
    this.password = password;
  }
  public Role getRole(){
    return role;
  }
  public void setRole(Role role){
    this.role=role;
  }
  public List<Order> getOrders(){
    return orders;
  }
  public void setOrder(List<Order>orders){
    this.orders=orders;
  }
  public void addOrder(Order order){
    this.orders.add(order);
    // order.setUser(this);
  }
  public void removeOrder(Order order){
    this.orders.remove(order);
    // order.setUser(null);
  }
}
