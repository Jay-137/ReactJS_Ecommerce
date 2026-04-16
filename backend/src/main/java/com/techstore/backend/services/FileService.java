package com.techstore.backend.services;

// import java.io.File;
import java.io.IOException;
import java.util.HashMap;
// import java.nio.file.Files;
// import java.nio.file.Path;
// import java.nio.file.Paths;
// import java.nio.file.StandardCopyOption;
import java.util.Map;
// import java.util.UUID;

// import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class FileService {
  
  // @Value("${file.upload-dir}")
  // private String uploadDir;

  private final Cloudinary cloudinary;
  public FileService(Cloudinary cloudinary){
    this.cloudinary=cloudinary;
  }

  public Map<String, String> saveImage(MultipartFile file) throws IOException{
      if(file.isEmpty()){
        throw new RuntimeException("Cannot upload empty File");
      }
      // File directory=new File(uploadDir);
      // if(!directory.exists()){
      //   directory.mkdirs();
      // }
      // String originalName=file.getOriginalFilename();
      // String extension="";
      // if(originalName!=null && originalName.contains(".") ){
      //   extension=originalName.substring(originalName.lastIndexOf("."));
      // }
      // String uniqueFileName=UUID.randomUUID().toString()+extension;
      // Path targetLocation=Paths.get(uploadDir).resolve(uniqueFileName);
      // Files.copy(file.getInputStream(),targetLocation,StandardCopyOption.REPLACE_EXISTING);
      // return "/uploads/"+uniqueFileName;

      Map<?,?> uploadResult=cloudinary.uploader().upload(file.getInputStream(), ObjectUtils.asMap("resource_type","image","folder","products"));
      Map<String, String> result = new HashMap<>();
      result.put("url", uploadResult.get("secure_url").toString());
      result.put("publicId", uploadResult.get("public_id").toString());

      return result;

  }
  public void deleteImage(String publicId) throws IOException{
    cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
  }
}
