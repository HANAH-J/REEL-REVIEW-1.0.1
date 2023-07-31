package com.reelreview.config;

import com.reelreview.config.oauth.OAuth2AuthenticationSuccessHandler;
import com.reelreview.config.oauth.Oauth2PrincipalUserService;
import com.reelreview.config.jwt.filter.JwtAuthorizationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity // 스프링 시큐리티 필터가 스프링 필터체인에 등록
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Bean // 해당 메서드의 리턴되는 오브젝트를 IoC로 등록
    public BCryptPasswordEncoder encodePwd() {
        return new BCryptPasswordEncoder();
    }

    @Autowired
    private Oauth2PrincipalUserService oauth2PrincipalUserService;

    @Autowired
    private OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    @Autowired
    private JwtAuthorizationFilter jwtAuthorizationFilter;

    @Override
    protected void configure(HttpSecurity http) throws  Exception {
        http.
                // cors 정책 : Application에서 작업을 해두었으므로 기본 설정 사용
                cors().and()
                // csrf 대책 : CSRF에 대한 대책을 비활성화
                .csrf().disable()
                // Basic 인증 : Bearer token 인증방법을 사용하기 때문에 비활성화
                .httpBasic().disable()
                // 세션 기반 인증 : Session 기반 인증을 사용하지 않기 때문에 비활성화
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                // '/', '/api/auth' 모듈에 대해서는 모두 허용 : 인증없이 사용가능
                .authorizeRequests().antMatchers("/**", "/api/auth/**").permitAll()
                // 나머지 Request에 대해서는 모두 인증되지 않은 사용자도 사용가능
                .anyRequest().permitAll().and()
                // 소셜 로그인 설정
                .oauth2Login().userInfoEndpoint().userService(oauth2PrincipalUserService).and() // principalUserService 설정
                .successHandler(oAuth2AuthenticationSuccessHandler);                            // 소셜 로그인 성공 핸들러

        http.
                addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class);
    }
}