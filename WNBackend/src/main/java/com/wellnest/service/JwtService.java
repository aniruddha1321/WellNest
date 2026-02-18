package com.wellnest.service;

import io.jsonwebtoken.Claims; 
import io.jsonwebtoken.Jwts; 
import io.jsonwebtoken.SignatureAlgorithm; 
import io.jsonwebtoken.security.Keys; 
import org.springframework.beans.factory.annotation.Value; 
import org.springframework.stereotype.Service; 

import java.security.Key; // import key type
import java.util.Date; // import date
import java.util.HashMap; // import hash map
import java.util.Map; // import map
import java.util.function.Function; // import function

@Service 
public class JwtService { // jwt service class

    @Value("${jwt.secret}") // inject jwt secret
    private String secret; 

    @Value("${jwt.expiration}") 
    private Long expiration; // token expiration

    public String generateToken(String email) { // generate jwt token
        Map<String, Object> claims = new HashMap<>(); 
        return createToken(claims, email); 
    } 

    private String createToken(Map<String, Object> claims, String subject) { // build token with claims
        Date now = new Date(); // capture issue time
        Date expiryDate = new Date(now.getTime() + expiration); // compute expiry time

        return Jwts.builder() // start token builder
                .setClaims(claims) 
                .setSubject(subject) 
                .setIssuedAt(now) // set issued time
                .setExpiration(expiryDate) 
                .signWith(getSignKey(), SignatureAlgorithm.HS256) // sign token
                .compact(); // serialize token
    }

    private Key getSignKey() { // build signing key
        return Keys.hmacShaKeyFor(secret.getBytes()); 
    } 

    public String extractEmail(String token) { // extract subject email
        return extractClaim(token, Claims::getSubject); 
    } 

    public Date extractExpiration(String token) { // extract expiration date
        return extractClaim(token, Claims::getExpiration); 
    } 

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) { // generic claim extraction
        final Claims claims = extractAllClaims(token); // parse all claims
        return claimsResolver.apply(claims); // apply resolver
    }

    private Claims extractAllClaims(String token) { // parse token claims
        return Jwts.parserBuilder() // start parser builder
                .setSigningKey(getSignKey()) // set signing key
                .build() // build parser
                .parseClaimsJws(token) // parse token
                .getBody(); // return claims body
    } 

    private Boolean isTokenExpired(String token) { // check expiration
        return extractExpiration(token).before(new Date()); 
    } 

    public Boolean validateToken(String token, String email) { // validate token and email
        final String tokenEmail = extractEmail(token); // extract email
        return (tokenEmail.equals(email) && !isTokenExpired(token)); // verify subject and expiry
    } 
}
