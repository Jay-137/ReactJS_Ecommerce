package com.techstore.backend.controllers;

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
  public ProductDto geProductById(@PathVariable Long id){
    Product product=productService.getProductById(id);
    return convertToDTO(product);
  }
  @PostMapping("/{id}/image")
  public ProductDto uploadImage(@PathVariable Long id,@RequestParam("image") MultipartFile image){
    Product updatedProduct=productService.saveImage(id, image);
    return new ProductDto(updatedProduct.getId(),updatedProduct.getName(),updatedProduct.getDescription(),updatedProduct.getPrice(),updatedProduct.getImageUrl());
  }
  @PostMapping
  public ProductDto createProduct(@Valid @RequestBody Product product){
    return convertToDTO(productService.createProduct(product));
  }
  @PutMapping("/{id}")
  public ProductDto updateProduct(@PathVariable Long id,@RequestBody Product product){
    return convertToDTO(productService.updateProduct(id, product));
  }
  
  @DeleteMapping("/{id}")
  public void deleteProduct(@PathVariable Long id){
    productService.deleteProduct(id);
  }

  private ProductDto convertToDTO(Product product){
    return new ProductDto(product.getId(),product.getName(),product.getDescription(),product.getPrice(),product.getImageUrl());
  }

}
