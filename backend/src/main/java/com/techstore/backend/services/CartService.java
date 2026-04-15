package com.techstore.backend.services;

import com.techstore.backend.models.Product;
import com.techstore.backend.models.User;

import org.springframework.stereotype.Service;

import com.techstore.backend.models.Cart;
import com.techstore.backend.models.CartItem;
import java.util.Optional;
import com.techstore.backend.repositories.*;

@Service
public class CartService {
  private final UserRepository userRepository;
  private final ProductRepository productRepository;
  private final CartRepository cartRepository;
  public CartService(UserRepository userRepository, ProductRepository productRepository, CartRepository cartRepository){
    this.productRepository=productRepository;
    this.cartRepository=cartRepository;
    this.userRepository=userRepository;
  }
  public Cart addToCart(Long userId,Long productId, Integer quantity){
    
    Cart cart=getCartByUserId(userId);
    Product product=getProductById(productId);

    Optional<CartItem>itemOpt=cart.getItems().stream().filter(item->item.getProduct().getId().equals(productId)).findFirst();
    if(itemOpt.isPresent()){
      CartItem item=itemOpt.get();
      item.setQuantity(item.getQuantity()+quantity);
    }else{
      CartItem item=new CartItem(cart,product,quantity);
      cart.getItems().add(item);
    }
    return cartRepository.save(cart);
  }
  public Cart getCartByUserId(Long userId) {
        User user=userRepository.findById(userId).orElseThrow(()->new RuntimeException("User not found with id:" + userId));
        return user.getCart();
  }
  public Cart updateCart(Long userId,Long productId,Integer quantity){
    Cart cart=getCartByUserId(userId);
    cart.getItems().stream()
                    .filter(item->item.getProduct().getId().equals(productId))
                    .findFirst()
                    .ifPresent(item->item.setQuantity(quantity));
    return cartRepository.save(cart);
  }
  public Cart removeItemFromCart(Long userId,Long productId){
    Cart cart=getCartByUserId(userId);
    cart.getItems().removeIf(item->item.getProduct().getId().equals(productId));
    return cartRepository.save(cart);
  }

  public Product getProductById(Long productId){
     Product product=productRepository.findById(productId).orElseThrow(()->new RuntimeException("Product not found with id:" + productId));
     return product;
  }
}
