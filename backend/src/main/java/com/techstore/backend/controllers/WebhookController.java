package com.techstore.backend.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.StripeObject;
import com.stripe.net.Webhook;
import com.techstore.backend.services.OrderService;

@RestController
@RequestMapping("/api/webhook")
public class WebhookController {
  @Value("${stripe.webhook.secret}")
  private String endpointSecret;

  private final OrderService orderService;
  public WebhookController(OrderService orderService){
    this.orderService=orderService;
  }

  @PostMapping("/stripe")
  public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload,@RequestHeader("Stripe-Signature") String sigHeader){
    Event event;
    try{
      event=Webhook.constructEvent(payload, sigHeader, endpointSecret);
    }catch (SignatureVerificationException e){
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Signature");
    }
    StripeObject stripeObject=event.getDataObjectDeserializer().getObject().orElse(null);
// System.out.println("Event type: " + event.getType());
// System.out.println("Stripe object: " + stripeObject);
// System.out.println("Event API version: " + event.getApiVersion());
    if(stripeObject instanceof PaymentIntent){
      PaymentIntent paymentIntent=(PaymentIntent) stripeObject;
      String intentId=paymentIntent.getId();
      switch (event.getType()) {
        case "payment_intent.succeeded":
          System.out.println("Payment succeeded for Intent id: "+ intentId);
          orderService.fulfillOrder(intentId);
          
          break;
        case "payment_intent.payment_failed":
              System.out.println("Payment failed for Intent id: "+ intentId);
              orderService.failOrder(intentId);
          
          break;
      
        default:
          break;
      }
    }
    return ResponseEntity.ok("Success");
  }
}
