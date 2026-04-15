package com.techstore.backend.services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
  
  private final JavaMailSender javaMailSender;
  public EmailService(JavaMailSender javaMailSender){
    this.javaMailSender=javaMailSender;
  }
  @Async
  public void sendConfirmationMail(String userEmail){
    try{
      SimpleMailMessage message=new SimpleMailMessage();
      message.setFrom("jaycu1731@gmail.com");
      message.setTo(userEmail);
      message.setSubject("TechStore - Order Confirmation");
      message.setText("Thank you for your order! Your items will be shipped shortly.");
      javaMailSender.send(message);
      System.out.println("Real email successfully sent to " + userEmail);
    }
    catch(Exception e){
      System.err.println("Failed to send email: " + e.getMessage());
    }
  }
}
