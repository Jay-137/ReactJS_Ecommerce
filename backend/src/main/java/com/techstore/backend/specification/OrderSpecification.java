package com.techstore.backend.specification;

import java.time.LocalDate;

import org.springframework.data.jpa.domain.Specification;

import com.techstore.backend.models.Order;

public class OrderSpecification {
  
  public  static Specification<Order> hasUserId(Long userId){
    return (root,query,cb)->userId==null?null:cb.equal(root.get("user").get("id"), userId);
  }
  public static  Specification<Order> hasStatus(String status){
    return (root,query,cb)->status==null?null:cb.like(root.get("status"), "%"+status+"%");
  }
  public  static Specification<Order> createdAfter(LocalDate start){
    return (root,query,cb)->start==null?null:cb.greaterThanOrEqualTo(root.get("createdAt"), start);
  }
  public static  Specification<Order> createdBefore(LocalDate end){
    return (root,query,cb)->end==null?null:cb.lessThanOrEqualTo(root.get("createdAt"), end);
  }
}
