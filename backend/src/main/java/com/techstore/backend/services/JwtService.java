package com.techstore.backend.services;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.techstore.backend.models.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

  @Value("${jwt.secret}")
  private String secretKey; 

  @Value("${jwt.expiration}")
  private long jwtExpiration;



  public String generateToken(User user){
    return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole().name())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+jwtExpiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
  }


  public String extractMail(String token){
    Claims claims=Jwts.parserBuilder()
                              .setSigningKey(getSignInKey())
                              .build()
                              .parseClaimsJws(token)
                              .getBody();  
    return claims.getSubject();
  }

  public String extractRole(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        // Extract the custom "role" claim we added during generation
        return claims.get("role", String.class); 
  }

  public boolean isTokenValid(String token,String userEmail){
    final String extractedEmail=extractMail(token);
    return (extractedEmail.equals(userEmail) && !isTokenExpired(token));
  }

//   private Claims extractAllClaims(String token) {
//     return Jwts.parserBuilder()
//                .setSigningKey(getSignInKey())
//                .build()
//                .parseClaimsJws(token)
//                .getBody();
// // }
// extractMail → extractAllClaims(token).getSubject()
// isTokenExpired → extractAllClaims(token).getExpiration()


  private boolean isTokenExpired(String token){
    Date expiration=Jwts.parserBuilder()
                        .setSigningKey(getSignInKey())
                        .build()
                        .parseClaimsJws(token)
                        .getBody()
                        .getExpiration();
    return expiration.before(new Date());
  }
  private Key getSignInKey(){
    byte[] keyBytes=secretKey.getBytes();
    return Keys.hmacShaKeyFor(keyBytes);
  }
}
