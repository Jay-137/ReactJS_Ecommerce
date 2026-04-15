package com.techstore.backend.dtos;

import java.time.LocalDateTime;

public class OrderQueryDto {
  private int pageNo=0;
  private int pageSize=10;
  private String sortDir="asc";
  private String sortBy="id";

  private Long userId;
  private String status;
  private LocalDateTime start;
  private LocalDateTime end;

  
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
  public String getStatus() {
    return status;
  }
  public void setStatus(String status) {
    this.status = status;
  }
  public LocalDateTime getStart() {
    return start;
  }
  public void setStart(LocalDateTime start) {
    this.start = start;
  }
  public LocalDateTime getEnd() {
    return end;
  }
  public void setEnd(LocalDateTime end) {
    this.end = end;
  }
  public Long getUserId() {
    return userId;
  }
  public void setUserId(Long userId) {
    this.userId = userId;
  }
  
}
