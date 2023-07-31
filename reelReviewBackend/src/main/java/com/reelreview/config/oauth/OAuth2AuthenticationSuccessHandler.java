package com.reelreview.config.oauth;

import com.reelreview.config.auth.PrincipalDetails;
import com.reelreview.config.jwt.JwtTokenProvider;
import com.reelreview.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private static final String TOKEN = "token";
    private static final String REFRESH_TOKEN = "refreshToken";
    private static final String REDIRECT_URL = "http://localhost:3000";

    private final UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        // JWT 토큰 수신
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        String token = principalDetails.getJwtToken();
        // System.out.println("소셜 로그인 성공! jwt 토큰 리액트로 전송! : " + token);

        // JWT 토큰을 헤더에 포함하여 클라이언트에게 전달
//        response.setHeader("Authorization", "Bearer " + token);

//        // JWT 토큰을 쿠키에 저장
        Cookie tokenCookie = new Cookie("token", token);
        tokenCookie.setPath("/");       // 모든 경로에서 쿠키에 접근할 수 있도록 설정
//        tokenCookie.setHttpOnly(true);  // JavaScript로 쿠키에 접근을 막음 (XSS 방지) 나중에 보안 처리
        tokenCookie.setMaxAge(3600);    // 쿠키 유효 기간 (초 단위, 1시간으로 설정)

        // 쿠키를 클라이언트로 전송
        response.addCookie(tokenCookie);

        // 로그인 성공 후 클라이언트로 리다이렉트
        getRedirectStrategy().sendRedirect(request, response, REDIRECT_URL);
    }
}