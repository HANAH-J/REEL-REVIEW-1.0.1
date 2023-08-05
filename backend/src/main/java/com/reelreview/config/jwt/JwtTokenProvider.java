package com.reelreview.config.jwt;

import com.reelreview.config.auth.PrincipalDetails;
import com.reelreview.domain.user.UserEntity;
import com.reelreview.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

// JWT : 전자 서명이 된 JSON 형태 토큰 (header).(payload).(signature)
// header: typ(해당 토큰의 타입), alg(토큰 서명을 위해 사용된 해시 알고리즘)
// payload: sub(해당 토큰의 주인), iat(토큰 발행시간), exp(토큰 만료시간)

@Service
public class JwtTokenProvider {

    @Autowired
    private UserRepository userRepository;

    private final RedisTemplate<String, String> redisTemplate;

    // 생성자를 통해 RedisTemplate 주입
    public JwtTokenProvider(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Value("${jwt.refreshToken.expirationInMs}")
    private long refreshTokenExpirationInMs;

    // JWT 생성 및 검증을 위한 키
    private static final String SECURITY_KEY = "reelreviewsecretkey";

    // JWT 생성
    public String create(Authentication authentication) {

        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        String userEmail = principalDetails.getUserEntity().getUserEmail();
        // System.out.println("토큰 userEntity" + principalDetails.getUserEntity());

        UserEntity userInfo = userRepository.findByUserEmail(userEmail);

        Map<String, Object> claims = new HashMap<>();
        claims.put("username", userInfo.getUsername());
        claims.put("role", userInfo.getRole());

        // 만료날짜 : 현재 날짜 + 1시간
        Date exprTime = Date.from(Instant.now().plus(1, ChronoUnit.HOURS));

        return Jwts.builder()
                // 암호화에 사용될 알고리즘, 키
                .signWith(SignatureAlgorithm.HS512, SECURITY_KEY)
                // JWT 제목, 생성일, 만료일
                .setClaims(claims)
                .setSubject(userEmail)
                .setIssuedAt(new Date())
                .setExpiration(exprTime)
                // 생성
                .compact();
    }

    // JWT 검증
    public String validate(String token) {
        // 매개변수로 받은 토큰을 키를 사용하여 복호화(디코딩)
        Claims claims = Jwts.parser().setSigningKey(SECURITY_KEY).parseClaimsJws(token).getBody();

        // 복호화된 토큰의 payload에서 제목 수신
        return claims.getSubject();
    }

    // JWT 권한 디코딩
    public String getAuthority(String token) {
        // 매개변수로 받은 토큰을 키를 사용하여 복호화(디코딩)
        Claims claims = Jwts.parser().setSigningKey(SECURITY_KEY).parseClaimsJws(token).getBody();

        // 복호화된 토큰의 payload에서 제목 수신
        return claims.get("role").toString();
    }
}