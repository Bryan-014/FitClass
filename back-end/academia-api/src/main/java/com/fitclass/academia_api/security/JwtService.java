package com.fitclass.academia_api.security;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;

@Service
public class JwtService {

    private static final String SECRET_KEY = "BFxpdNB6BA08bdz8utFdKG9yUB4YP7KokA8x25fLmfxNuXY2/CpUwSGxyf+80fmcf2JANDmOEBysAo5NLPi91e04eqnxgbA5437AGsVGcavRq0gLujYOPQHqZ+4dH9QftrqtJ+MDJ8M6FMPRXNFKhKX8/dnu4TZCGriyNabiPP287fjzLQtWfU5drpl5WsFnoPwCknXwSF4opkqszRIEHZiBLVpirFYhXc2lAyMQv0i53kFV0MYcBSter/AxPa5vJTvmI05csJq3SGe7ZjnK456CNSGchPOboVw4wa0y+Us84y6U4cjjSwDf3Ae3CzLjRnroX1K6Xg7LH/0RGxnaZ1IduedFFB6BgA6yhCPE2gs=";


    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }


    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }


    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 24)) 
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}