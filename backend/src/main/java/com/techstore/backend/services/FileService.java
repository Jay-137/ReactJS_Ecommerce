package com.techstore.backend.services;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileService {
  
  @Value("${file.upload-dir}")
  private String uploadDir;

  public String saveImage(MultipartFile file) throws IOException{
      if(file.isEmpty()){
        throw new RuntimeException("Cannot upload empty File");
      }
      File directory=new File(uploadDir);
      if(!directory.exists()){
        directory.mkdirs();
      }
      String originalName=file.getOriginalFilename();
      String extension="";
      if(originalName!=null && originalName.contains(".") ){
        extension=originalName.substring(originalName.lastIndexOf("."));
      }
      String uniqueFileName=UUID.randomUUID().toString()+extension;
      Path targetLocation=Paths.get(uploadDir).resolve(uniqueFileName);
      Files.copy(file.getInputStream(),targetLocation,StandardCopyOption.REPLACE_EXISTING);
      return "/uploads/"+uniqueFileName;
  }
}
