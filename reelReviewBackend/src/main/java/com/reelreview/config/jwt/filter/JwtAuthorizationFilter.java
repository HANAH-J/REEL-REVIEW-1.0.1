package com.reelreview.config.jwt.filter;

import com.reelreview.config.jwt.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

@Component
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    // Request 수신 시 Request Header의 Authorization 필드의 Bearer Token을 가져온다.
    // 가져온 Token을 검증하고 검증 결과를 SecurityContext에 추가
    @Autowired private JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String token = parseBearerToken(request);

            if (token != null && !token.equalsIgnoreCase("null")) {

                // 토큰을 검증하여 payload의 userEmail을 가져온다.
                String userEmail = jwtTokenProvider.validate(token);

                String role = jwtTokenProvider.getAuthority(token);
                Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
                authorities.add(new SimpleGrantedAuthority(role));

                // SecurityContext에 추가할 객체
                AbstractAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userEmail, null, authorities);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // SecurityContext에 AbstractAuthenticationToken 객체를 추가해서
                // 해당 Thread가 지속적으로 인증 정보를 가질 수 있도록 해준다.
                SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
                securityContext.setAuthentication(authentication);
                SecurityContextHolder.setContext(securityContext);
            }
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        filterChain.doFilter(request, response);
    }

    // Request Header의 Authorization 필드의 Bearer Token을 가져오는 메서드
    private String parseBearerToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}