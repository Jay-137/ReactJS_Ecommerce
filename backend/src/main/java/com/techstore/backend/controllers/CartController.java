package com.techstore.backend.controllers;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.techstore.backend.dtos.CartDto;
import com.techstore.backend.dtos.CartRequestDto;
import com.techstore.backend.models.Cart;
import com.techstore.backend.models.CartItem;
import com.techstore.backend.models.User;
import com.techstore.backend.services.CartService;
import com.techstore.backend.services.UserService;
import com.techstore.backend.dtos.CartItemDto;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
public class CartController {
  private final CartService cartService;
  private final UserService userService;
  public CartController(CartService cartService,UserService userService){
    this.cartService=cartService;
    this.userService=userService;
  }
  @PostMapping
  public CartDto addItemToCart(@RequestBody CartRequestDto incomingCartRequest ){
    User user=userService.getAuthenticatedUser();
    Cart savedCart=cartService.addToCart(
                                        user.getId(),
                                        incomingCartRequest.productid(),
                                        incomingCartRequest.quantity());
    return convertToDto(savedCart);
  }
  // @GetMapping("/{userId}")
  // public CartDto getCart(@PathVariable Long userId){
  //   Cart cart=cartService.getCartByUserId(userId);
  //   return convertToDto(cart);
  // }

  //better with jwt authorisation
  @GetMapping
  public CartDto getCart(){
    User user=userService.getAuthenticatedUser();
    Cart cart=cartService.getCartByUserId(user.getId());
    return convertToDto(cart);
  }
  @PutMapping("/update")
  public CartDto updateCart(@RequestParam Long productId, @RequestParam Integer quantity){
    User user=userService.getAuthenticatedUser();
    Cart cart=cartService.updateCart(user.getId(), productId, quantity);
    return convertToDto(cart);
  }
 @DeleteMapping("/remove")
  public CartDto removeItemFromCart(@RequestParam Long productId){
    User user=userService.getAuthenticatedUser();
    Cart cart=cartService.removeItemFromCart(user.getId(), productId);
    return convertToDto(cart);
  }

  private CartDto convertToDto(Cart cart){
    List<CartItemDto>items=convertToItemDto(cart.getItems());
    return new CartDto(cart.getId(),cart.getUser().getId(),items);
  } 
  private List<CartItemDto> convertToItemDto(List<CartItem>item){
    return item.stream().map(it->new CartItemDto(it.getProduct().getId(),
                                                  it.getProduct().getName(),
                                                  it.getProduct().getPrice(),
                                                  it.getQuantity())).collect(Collectors.toList());
  }
 
}
