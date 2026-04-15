package com.techstore.backend.services;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import com.techstore.backend.dtos.PaginatedResponseDto;
import com.techstore.backend.dtos.ProductDto;
import com.techstore.backend.dtos.ProductQueryDto;
import com.techstore.backend.models.Product;
import com.techstore.backend.repositories.ProductRepository;
import com.techstore.backend.specification.ProductSpecification;
@Service
public class ProductService {
  private final ProductRepository productRepository;
  private final FileService fileService;
  public ProductService(ProductRepository productRepository,FileService fileService){
    this.productRepository=productRepository;
    this.fileService=fileService;
  }
  public Product createProduct(Product product){
    return productRepository.save(product);
  }
  public Product updateProduct(Long id,Product product){
    Product existing=getProductById(id);
    existing.setName(product.getName());
    existing.setDescription(product.getDescription());
    existing.setDescription(product.getDescription());
    return productRepository.save(existing);
  }
  public PaginatedResponseDto<ProductDto> getAllProducts(ProductQueryDto query){

    Sort sort=query.getSortDir().equalsIgnoreCase(Sort.Direction.ASC.name())?
                                                  Sort.by(query.getSortBy()).ascending():
                                                  Sort.by(  query.getSortBy()).descending();

    Pageable pageable=PageRequest.of(query.getPageNo(),
                                     query.getPageSize(), 
                                     sort);

    Specification<Product> spec=Specification.where(ProductSpecification.hasCategory(query.getCategory()))
                                             .and(ProductSpecification.hasBrand(query.getBrand()))
                                             .and(ProductSpecification.isFeatured(query.getFeatured()))
                                             .and(ProductSpecification.priceBetween(query.getMinPrice(), query.getMaxPrice()));
    Page<Product> productsPage=productRepository.findAll(spec,pageable);

    List<ProductDto> content=productsPage.getContent().stream().map(this::convertToDto).collect(Collectors.toList());
    return new PaginatedResponseDto<>(content,
                                       productsPage.getNumber(), 
                                       productsPage.getSize(),
                                        productsPage.getTotalElements(),
                                        productsPage.getTotalPages(), 
                                        productsPage.isLast());
  }
  public Product getProductById(Long id){
    return productRepository.findById(id).orElseThrow(()->new RuntimeException("Product not found with id:"+id));
  }

  public Product saveImage(Long id,MultipartFile file){
    Product product=getProductById(id);
    try{
      String path=fileService.saveImage(file);
      product.setImageUrl(path);
      return productRepository.save(product);
    }
    catch(IOException e){
      throw new RuntimeException("Could not store image. Error: " + e.getMessage());
    }
  }
  public void deleteProduct(Long id){
    Product product=getProductById(id);
    productRepository.delete(product);
  }
  private ProductDto convertToDto(Product item){
    return new ProductDto(item.getId(), item.getName(), item.getDescription() , item.getPrice(), item.getImageUrl());
  }
}
