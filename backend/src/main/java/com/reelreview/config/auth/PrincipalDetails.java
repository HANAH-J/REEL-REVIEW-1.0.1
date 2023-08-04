package com.reelreview.config.auth;

// 시큐리티가 /login 주소 요청이 오면 가로채서 로그인을 진행
// 로그인 진행이 완료되면 시큐리티 session을 만들어 준다. (Security ContextHolder)
// 오브젝트 -> Authentication 타입 객체
// Authentication 내부에 User 정보가 있어야 된다.
// User 오브젝트 타입 -> UserDetails 타입 객체

import com.reelreview.domain.user.UserEntity;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

// Security Session -> Authentication -> UserDetails(PrincipalDetails)

@Data
public class PrincipalDetails  implements UserDetails, OAuth2User {
    
    private UserEntity userEntity;
    private  Map<String, Object> attributes;
    private String jwtToken;

    // JWT 토큰 설정
    public void setJwtToken(String jwtToken) {
        this.jwtToken = jwtToken;
    }

    // JWT 토큰 반환
    public String getJwtToken() {
        return jwtToken;
    }

    // 일반 로그인
    public PrincipalDetails(UserEntity userEntity) {
        this.userEntity = userEntity;
    }

    // OAuth2 로그인
    public PrincipalDetails(UserEntity userEntity, Map<String, Object> attributes) {
        this.userEntity = userEntity;
        this.attributes = attributes;
    }

    // 해당 User의 권한 리턴
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collect = new ArrayList<>();
        collect.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return userEntity.getRole();
            }
        });
        return collect;
    }

    @Override
    public String getUsername() {
        return userEntity.getUsername();
    }

    @Override
    public String getPassword() {
        return userEntity.getUserPassword();
    }

    // 계정 만료 여부
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // 계정 잠금 여부
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    // 계정 비밀번호 설정 일수
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // 계정 활성화 여부
    @Override
    public boolean isEnabled() {
        // 사이트에서 1년 동안 로그인을 하지 않아 휴먼 계정으로 변환될 때
        // 현재시간 - 로그인시간 = 1년 초과 시 return false;
        return true;
    }

    @Override
    public <A> A getAttribute(String name) {
        return OAuth2User.super.getAttribute(name);
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public String getName() {
        return null;
    }

    public String getUserEmail() {
        return userEntity.getUserEmail();
    }
}