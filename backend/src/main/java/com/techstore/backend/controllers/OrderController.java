package com.techstore.backend.controllers;


import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.techstore.backend.dtos.OrderDto;
import com.techstore.backend.dtos.OrderQueryDto;
import com.techstore.backend.dtos.PaginatedResponseDto;
import com.techstore.backend.models.User;
import com.techstore.backend.services.OrderService;
import com.techstore.backend.services.UserService;

@RestController 
@RequestMapping("/api/orders")
public class OrderController {
  private final OrderService orderService;
  private final UserService userService;
  public OrderController(OrderService orderService,UserService userService){
    this.orderService=orderService;
    this.userService=userService;
  }
  // @PostMapping("/checkout/{userId}")
  // public Map<String,String> initiateCheckout(@PathVariable Long userId){
  //   try{
  //     String clientSecret=orderService.createCheckoutSession(userId);
  //     return Map.of("clientSecret", clientSecret);
  //   }catch(Exception e){
  //     throw new RuntimeException("Error initiating checkout: " + e.getMessage());
  //   }
    
  // }
  @PostMapping("/checkout")
  public Map<String,String> initiateCheckout(){
    
    try{
    User user=userService.getAuthenticatedUser();
    String clientSecret=orderService.createCheckoutSession(user.getId());
    return Map.of("clientSecret", clientSecret);
    }
    catch(Exception e){
      throw new RuntimeException("Error initiating checkout: " + e.getMessage());
    }
  }
  // @GetMapping("/my-history")
  // public PaginatedResponseDto<OrderDto> getUserOrders(
  //                                           @RequestParam(value="pageNo",
  //                                                         defaultValue = "0",
  //                                                         required = false) 
  //                                                         int pageNo,
  //                                           @RequestParam(value="pageSize",
  //                                                         defaultValue="10",
  //                                                         required = false)
  //                                                         int pageSize,
  //                                           @RequestParam(value="sortBy",
  //                                                          defaultValue = "createdAt",
  //                                                          required = false)
  //                                                          String sortBy,
  //                                          @RequestParam(value = "sortDir",
  //                                                        defaultValue = "desc",
  //                                                       required = false)
  //                                                       String sortDir ){
  //      User user=userService.getAuthenticatedUser();
  //      return orderService.getUserOrderHistory(user.getId(), pageNo, pageSize, sortDir, sortBy);                                                   
  // }
  @GetMapping("/my-history")
  public PaginatedResponseDto<OrderDto> getUserOrders(OrderQueryDto query){
    User user=userService.getAuthenticatedUser();
    query.setUserId(user.getId());
    return orderService.getUserOrderHistory(query);
  }

  @GetMapping("/{orderId}") 
  public OrderDto getOrder(@PathVariable Long orderId){
    User user=userService.getAuthenticatedUser();
    return orderService.getOrderDetails(orderId,user.getId());
  }                                                                 

}
