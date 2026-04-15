package com.techstore.backend.dtos;

public class ProductQueryDto {
  private int pageNo=0;
  private int pageSize=10;
  private String sortDir="asc";
  private String sortBy="id";

  private String category;
  private String brand;
  private Double minPrice;
  private Double maxPrice;
  private Boolean featured;

  public Boolean getFeatured() {
    return featured;
  }
  public void setFeatured(Boolean featured) {
    this.featured = featured;
  }
  //Getter Setter
  public int getPageNo() {
    return pageNo;
  }
  public void setPageNo(int pageNo) {
    this.pageNo = pageNo;
  }
  public int getPageSize() {
    return pageSize;
  }
  public void setPageSize(int pageSize) {
    this.pageSize = pageSize;
  }
  public String getSortDir() {
    return sortDir;
  }
  public void setSortDir(String sortDir) {
    this.sortDir = sortDir;
  }
  public String getSortBy() {
    return sortBy;
  }
  public void setSortBy(String sortBy) {
    this.sortBy = sortBy;
  }
  public String getCategory() {
    return category;
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
  public Double getMinPrice() {
    return minPrice;
  }
  public void setMinPrice(Double minPrice) {
    this.minPrice = minPrice;
  }
  public Double getMaxPrice() {
    return maxPrice;
  }
  public void setMaxPrice(Double maxPrice) {
    this.maxPrice = maxPrice;
  }

  
}
