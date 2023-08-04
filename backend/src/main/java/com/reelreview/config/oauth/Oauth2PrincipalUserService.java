package com.reelreview.config.oauth;

import com.reelreview.config.auth.PrincipalDetails;
import com.reelreview.config.oauth.provider.*;
import com.reelreview.config.jwt.JwtTokenProvider;
import com.reelreview.domain.ProfileDTO;
import com.reelreview.domain.user.UserEntity;
import com.reelreview.repository.ProfileRepository;
import com.reelreview.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class Oauth2PrincipalUserService extends DefaultOAuth2UserService {

    @Autowired
    @Lazy
    private UserRepository userRepository;

    @Autowired
    @Lazy
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ProfileRepository profileRepository;

    // 구글로부터 받은 userRequest 데이터에 대한 후처리 진행 함수
    // 함수 종료 시 @AuthenticationPrincipal 어노테이션 생성
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // registrationId로 어떤 OAuth2로 로그인했는지 확인 가능
        // System.out.println("getClientRegistration : " + userRequest.getClientRegistration());
        // System.out.println("getAccessToken : " + userRequest.getAccessToken().getTokenValue());

        OAuth2User oAuth2User = super.loadUser((userRequest));
        // 소셜 로그인 버튼 클릭 -> 소셜 로그인 창 -> 로그인 완료 -> code 리턴(OAuth-Client 라이브러리) -> AccessToken 요청
        // userRequest 정보 -> loadUser 함수 호출 -> 플랫폼으로부터 회원 프로필 수신
        // System.out.println("getAttributes : " + oAuth2User.getAttributes());

        // [소셜 회원가입]
        OAuth2UserInfo oAuth2UserInfo = null;
        if (userRequest.getClientRegistration().getRegistrationId().equals("kakao")) {
            // System.out.println("카카오 로그인 요청");
            oAuth2UserInfo = new KakaoUserInfo(oAuth2User.getAttributes());
        } else if (userRequest.getClientRegistration().getRegistrationId().equals("google")) {
            // System.out.println("구글 로그인 요청");
            oAuth2UserInfo = new GoogleUserInfo(oAuth2User.getAttributes());
        } else if (userRequest.getClientRegistration().getRegistrationId().equals("facebook")) {
            // System.out.println("페이스북 로그인 요청");
            oAuth2UserInfo = new FacebookUserInfo(oAuth2User.getAttributes());
        } else if (userRequest.getClientRegistration().getRegistrationId().equals("naver")) {
            // System.out.println("네이버 로그인 요청");
            oAuth2UserInfo = new NaverUserInfo(oAuth2User.getAttributes());
        } else {
            // System.out.println("카카오, 구글, 네이버 소셜 로그인 가능");
            // 페이스북 : https 문제 및 비즈니스 계정 문제로 실행 불가
        }

        String userEmail = oAuth2UserInfo.getUserEmail();
        String username = oAuth2UserInfo.getUserName();

        UserEntity userEntity = userRepository.findByUserEmail(userEmail);

        // 새로운 사용자일 경우, 회원가입 처리
        if (userEntity == null) {
            String provider = oAuth2UserInfo.getProvider();
            String providerCd = oAuth2UserInfo.getProviderCd();
            String role = "ROLE_USER";
            // System.out.println("OAuth2 로그인이 최초입니다.");
            userEntity = UserEntity.builder()
                    .username(username)
                    .userEmail(userEmail)
                    .role(role)
                    .provider(provider)
                    .providerCd(providerCd)
                    .build();

            userRepository.save(userEntity);

            // [프로필] ProfileDTO 생성(J)
            ProfileDTO profileDTO = new ProfileDTO();
            profileDTO.setUserCd(userEntity);

            // [프로필] 프로필 정보 저장 (J)
            try {
                profileRepository.save(profileDTO);
            } catch (Exception error) {
                System.out.println(error);
            }

            // 기존 사용자일 경우, 회원가입 처리 無
        } else if(userEntity.getProvider() == null) {
            // System.out.println("일반 회원이며, 해당 계정으로 소셜 회원가입을 진행하지 않았습니다.");
        } else {
            // System.out.println("로그인을 이미 한 적이 있습니다. 당신은 회원가입이 되어 있습니다.");
        }

        // JWT 토큰을 생성하여 사용자 정보와 함께 반환
        Authentication authentication = new UsernamePasswordAuthenticationToken(new PrincipalDetails(userEntity), null, null);
        String jwtToken = jwtTokenProvider.create(authentication);
        PrincipalDetails principalDetails = new PrincipalDetails(userEntity, oAuth2User.getAttributes());
        principalDetails.setJwtToken(jwtToken);

        return principalDetails;
    }
}