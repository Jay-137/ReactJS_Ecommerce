package com.techstore.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.techstore.backend.dtos.PaginatedResponseDto;
import com.techstore.backend.dtos.ProductDto;
import com.techstore.backend.dtos.ProductQueryDto;
import com.techstore.backend.services.ProductService;

import jakarta.validation.Valid;

import com.techstore.backend.models.Product;

@RestController
@RequestMapping("/api/products")
public class ProductController {
  private final ProductService productService;
  public ProductController(ProductService productService){
    this.productService=productService;
  }
  @GetMapping
  public PaginatedResponseDto<ProductDto> getAllProducts(ProductQueryDto query){
      return productService.getAllProducts(query);
    
  }
  @GetMapping("/{id}")
  public ProductDto getProductById(@PathVariable Long id){
    Product product=productService.getProductById(id);
    return new ProductDto(product.getId(), product.getName(), product.getDescription(), product.getPrice(), product.getImageUrl(), product.getBrand(), product.getCategory(), product.getFeatured());
  }
  @PostMapping("/{id}/image")
  public ProductDto uploadImage(@PathVariable Long id,@RequestParam("image") MultipartFile image){
    return productService.saveImage(id, image);
  }
  @PostMapping
  public ProductDto createProduct(@Valid @RequestBody Product product){
    return productService.createProduct(product);
  }
  @PutMapping("/{id}")
  public ProductDto updateProduct(@PathVariable Long id,@Valid @RequestBody Product product){
    return productService.updateProduct(id, product);
  }
  
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteProduct(@PathVariable Long id){
      productService.deleteProduct(id);
      return ResponseEntity.noContent().build();
  }

}
