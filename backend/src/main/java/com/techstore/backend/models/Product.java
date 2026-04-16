package com.techstore.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.*;

@Entity
public class Product {
  
  @Id
  @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;

  @NotBlank(message = "Product name cannot be empty")
  private String name;

  @NotBlank(message = "Product Description cannot be empty")
  @Column(columnDefinition = "TEXT")
  private String description;
  
  private String imagePublicId;
  private String imageUrl;

  @NotNull(message = "Price is required")
  @DecimalMin(value = "0.0", message = "Price cannot be negative")
  private Double price;

@NotBlank(message = "Category is required")
private String category;

@NotBlank(message = "Brand is required")
private String brand;

private Boolean featured;

public String getCategory() {
    return category;
}
public String getImagePublicId() {
    return imagePublicId;
}
public void setImagePublicId(String imagePublicId) {
    this.imagePublicId = imagePublicId;
}
public void setCategory(String category) {
    this.category = category;
}
public String getBrand() {
    return brand;
}
public void setBrand(String brand) {
    this.brand = brand;
}
public Boolean getFeatured() {
    return featured;
}
public void setFeatured(Boolean featured) {
    this.featured = featured;
}
  public Product(){

  }
  public Product(Long id,String name,String description,String imageUrl,Double price,String category,String brand,Boolean featured){
    this.id=id;
    this.description=description;
    this.name=name;
    this.imageUrl=imageUrl;
    this.price=price;
    this.category=category;
    this.brand=brand;
    this.featured=featured!=null?featured:false;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

}
