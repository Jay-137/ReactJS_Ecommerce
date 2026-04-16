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
import java.util.Map;
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
  public ProductDto createProduct(Product product){
    return convertToDto(productRepository.save(product));
  }
  public ProductDto updateProduct(Long id,Product product){
    Product existing=getProductById(id);
    existing.setName(product.getName());
    existing.setBrand(product.getBrand());
    existing.setCategory(product.getCategory());
    existing.setFeatured(product.getFeatured());
    existing.setPrice(product.getPrice());
    existing.setDescription(product.getDescription());
    return convertToDto(productRepository.save(existing));
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

  public ProductDto saveImage(Long id,MultipartFile file){
    Product product=getProductById(id);
    try{
      Map<String, String> uploadData=fileService.saveImage(file);
      String oldPublicId=product.getImagePublicId();
      product.setImageUrl(uploadData.get("url"));
      product.setImagePublicId(uploadData.get("publicId"));
      Product savedProduct=productRepository.save(product);
      if(oldPublicId!=null){
        try{
          fileService.deleteImage(oldPublicId);
        }catch(IOException e){
          System.out.println("Warning: Failed to delete old image");
        }
      }
      return convertToDto(savedProduct);
    }
    catch(IOException e){
      throw new RuntimeException("Could not store image. Error: " + e.getMessage());
    }
  }
  public void deleteProduct(Long id){
    Product product=getProductById(id);
    String oldPublicId=product.getImagePublicId();
    if (oldPublicId != null){
      try{
      fileService.deleteImage(oldPublicId);
    }
    catch (IOException e){
      System.out.println("Warning: Failed to delete old image");
    }
    }
    productRepository.delete(product);
  }
  private ProductDto convertToDto(Product item){
    return new ProductDto(item.getId(), item.getName(), item.getDescription() , item.getPrice(), item.getImageUrl(),item.getBrand(),item.getCategory(),item.getFeatured());
  }
}
