package com.reelreview.config.auth;

import com.reelreview.domain.user.UserEntity;
import com.reelreview.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

// 시큐리티 설정에서 loginProcessingUrl("/login");
// /login 요청이 오면 자동으로 UserDetailsService 타입으로 IoC 되어있는 loadUserByUsername 함수 실행
@Service
public class PrincipalDetailsService  implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    // Security Session(내부 Authentication(내부 UserDetails))
    // 함수 종료 시 @AuthenticationPrincipal 어노테이션이 만들어진다.
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // System.out.println("PrincipalDetailsService username : " + username);
        UserEntity userEntity = userRepository.findByUsername(username);
        if(userEntity != null) {
            return new PrincipalDetails(userEntity);
        }
        return null;
    }

}
