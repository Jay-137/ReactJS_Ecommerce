package com.techstore.backend.specification;

import org.springframework.data.jpa.domain.Specification;

import com.techstore.backend.models.Product;

public class ProductSpecification {
  private ProductSpecification(){}
  public static Specification<Product> hasCategory(String category){
    return (root,query,cb)->{
      return category==null?null:cb.equal(root.get("category"), category);
      };
    };
    public static Specification<Product> hasBrand(String brand){
      return (root,query,cb)->brand==null?null:cb.equal(root.get("brand"), brand);
    };
    public static Specification<Product> isFeatured(Boolean featured){
      return (root,query,cb)->featured==null?null:cb.equal(root.get("featured"), featured);
    };
    public static Specification<Product> priceBetween(Double minPrice,Double maxPrice){
      return (root,query,cb)->{
        if(minPrice==null && maxPrice==null)return null;
        else if(minPrice!=null && maxPrice!=null) return cb.between(root.get("price"), minPrice, maxPrice);
        else if(minPrice!=null)return cb.greaterThanOrEqualTo(root.get("price"), minPrice);
        else return cb.lessThanOrEqualTo(root.get("price"), maxPrice);
      };
    }
}
