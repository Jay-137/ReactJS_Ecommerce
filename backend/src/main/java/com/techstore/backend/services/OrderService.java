package com.techstore.backend.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.stripe.model.PaymentIntent;
import com.techstore.backend.dtos.OrderDto;
import com.techstore.backend.dtos.OrderItemDto;
import com.techstore.backend.dtos.OrderQueryDto;
import com.techstore.backend.dtos.PaginatedResponseDto;
import com.techstore.backend.models.Cart;
import com.techstore.backend.models.Order;
import com.techstore.backend.models.OrderItem;
import com.techstore.backend.repositories.OrderRepository;
import com.techstore.backend.specification.OrderSpecification;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final EmailService emailService;
    private final StripeService stripeService;

    public OrderService(OrderRepository orderRepository,CartService cartService,EmailService emailService,StripeService stripeService){
      this.orderRepository=orderRepository;
      this.cartService=cartService;
      this.emailService=emailService;
      this.stripeService=stripeService;
    }

    @Transactional
    public String createCheckoutSession(Long userId) throws Exception{
      Cart cart=cartService.getCartByUserId(userId);
      if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cannot place an order with an empty cart");
        }
      double totalAmount=cart.getItems().stream()
                                          .mapToDouble(item->item.getProduct().getPrice()*item.getQuantity())
                                          .sum();
      PaymentIntent intent=stripeService.createPaymentIntent(totalAmount, userId);

      Order order=new Order(cart.getUser(),totalAmount, "PENDING", intent.getId());
      cart.getItems().stream().forEach(item->{
        OrderItem orderItem= new OrderItem(item.getProduct().getId(), 
                                            item.getProduct().getName(),
                                            item.getProduct().getPrice(),
                                            item.getQuantity());
        order.addItem(orderItem);
      });

      cart.getUser().addOrder(order);
      orderRepository.save(order);
      return intent.getClientSecret();
    }

    @Transactional
    public void fulfillOrder(String paymentIntentId){
      Order order=orderRepository.findByStripePaymentIntentId(paymentIntentId)
                  .orElseThrow(()->new RuntimeException("No order found with paymentIntentId: "+ paymentIntentId));
      
      if(order.getStatus().equals("COMPLETE"))
        return;

      order.setStatus("COMPLETE");
      order.getUser().getCart().getItems().clear();
      orderRepository.save(order);
      emailService.sendConfirmationMail(order.getUser().getEmail());
    }

    @Transactional
    public void failOrder(String paymentIntentId){
       Order order=orderRepository.findByStripePaymentIntentId(paymentIntentId)
                  .orElseThrow(()->new RuntimeException("No order found with paymentIntentId: "+ paymentIntentId));
        order.setStatus("FAILED");
        orderRepository.save(order);
    }

    public PaginatedResponseDto<OrderDto> getUserOrderHistory(OrderQueryDto query){
      Sort sort=query.getSortDir().equalsIgnoreCase(Sort.Direction.ASC.name())?
                                        Sort.by(query.getSortBy()).ascending():
                                        Sort.by(query.getSortBy()).descending();
      Pageable pageable=PageRequest.of(query.getPageNo(), query.getPageSize(),sort);

      Specification<Order> spec=Specification.where(OrderSpecification.hasUserId(query.getUserId()))
                                             .and(OrderSpecification.hasStatus(query.getStatus()))
                                             .and(OrderSpecification.createdAfter(query.getStart()))
                                             .and(OrderSpecification.createdBefore(query.getEnd()));

      Page<Order> orderPage=orderRepository.findAll(spec,pageable);
      List<OrderDto>content=orderPage.getContent()
                                    .stream()
                                    .map(this::converToOrderDto)
                                    .collect(Collectors.toList());
      return new PaginatedResponseDto<>(content,
                                        orderPage.getNumber(),
                                        orderPage.getSize(),
                                        orderPage.getTotalElements(),
                                        orderPage.getTotalPages(),
                                        orderPage.isLast());
    }

    public OrderDto getOrderDetails(Long orderId,Long userId){

      Order order=orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
      if(!order.getUser().getId().equals(userId))
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to view this order.");
      return converToOrderDto(order);
    }

    private OrderDto converToOrderDto(Order order){
      List<OrderItemDto>itemDto=order.getItems().stream().map(this::convertToOrderItemDto).collect(Collectors.toList());
      return new OrderDto(order.getId(),order.getTotalAmount(),order.getStatus(),order.getCreatedAt(),itemDto);
    }
    private OrderItemDto convertToOrderItemDto(OrderItem item){
      return new OrderItemDto(item.getProductId(),item.getProductName(),item.getPriceAtPurchase(),item.getQuantity());
    }
}
