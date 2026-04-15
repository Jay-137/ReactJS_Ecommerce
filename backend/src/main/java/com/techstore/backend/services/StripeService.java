package com.techstore.backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import jakarta.annotation.PostConstruct;


@Service
public class StripeService {

  @Value("${stripe.api.key}")
  private String secretKey;

  @PostConstruct
  public void init(){
    Stripe.apiKey=secretKey;
  }

  public PaymentIntent createPaymentIntent(Double totalAmount,Long userId)throws Exception{
    PaymentIntentCreateParams params=PaymentIntentCreateParams.builder()
                                      .setAmount((long)(totalAmount*100))
                                      .setCurrency("inr")
                                      .putMetadata("userId", userId.toString())
                                      .setAutomaticPaymentMethods(PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                                                                           .setEnabled(true)
                                                                                            .build())
                                      .build();
    PaymentIntent intent= PaymentIntent.create(params);
    return intent;
  }
}
