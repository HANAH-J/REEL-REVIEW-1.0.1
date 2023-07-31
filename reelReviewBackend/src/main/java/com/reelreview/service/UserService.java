package com.reelreview.service;

import com.nimbusds.oauth2.sdk.util.StringUtils;
import com.reelreview.config.auth.PrincipalDetails;
import com.reelreview.config.jwt.JwtTokenProvider;
import com.reelreview.domain.ProfileDTO;
import com.reelreview.domain.user.*;
import com.reelreview.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.sql.Timestamp;
import java.util.Date;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    // (J)
    @Autowired
    private ProfileRepository profileRepository;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // 리프레시 토큰
    @Value("${jwt.refreshToken.expirationInMs}")
    private long refreshTokenExpirationInMs;

    @Autowired
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    @Autowired
    private JavaMailSender mailSender;

    // [회원가입]
    public ResponseDto<?> signUp(SignUpDto dto) {
        String username = dto.getUsername();
        String userEmail = dto.getUserEmail();
        String userPassword = dto.getUserPassword();

        // [회원가입] 이름, 이메일, 비밀번호 null 검사
        if (StringUtils.isBlank(username)) {
            return ResponseDto.setFail("이름란이 비었습니다.");
        }
        if (StringUtils.isBlank(userEmail)) {
            return ResponseDto.setFail("이메일란이 비었습니다.");
        }
        if (StringUtils.isBlank(userPassword)) {
            return ResponseDto.setFail("비밀번호란이 비었습니다.");
        }

        // [회원가입] 이메일 중복 검사
        try {
            if (userRepository.existsByUserEmail(userEmail)) {
                return ResponseDto.setFail("존재하는 이메일");
            }
        } catch (Exception error) {
            return ResponseDto.setFail("데이터베이스 에러");
        }

        // [회원가입] 비밀번호 유효성 검사 로직
        // [회원가입] 비밀번호 : 영문, 숫자, 특수문자 중 2개 이상을 조합하여 최소 10자리 이상
        if (!userPassword.matches("^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?:[0-9]+))$)[A-Za-z\\d~!@#$%^&*()_+=]{10,}$")) {
            return ResponseDto.setFail("유효하지 않은 비밀번호");
        }

        // [회원가입] 회원정보 생성
        dto.setRole("ROLE_USER");
        UserEntity userEntity = new UserEntity(dto);

        // [회원가입] 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(userPassword);
        userEntity.setUserPassword(encodedPassword);

        // [프로필] ProfileDTO 생성(J)
        ProfileDTO profileDTO = new ProfileDTO();
        profileDTO.setUserCd(userEntity);

        // [회원가입] 회원정보 저장
        try {
            userRepository.save(userEntity);
        } catch (Exception error) {
            return ResponseDto.setFail("데이터베이스 에러");
        }

        // [프로필] 프로필 정보 저장 (J)
        try {
            profileRepository.save(profileDTO);
        } catch (Exception error) {
            return ResponseDto.setFail("데이터베이스 에러");
        }

        // [회원가입] 성공 시 반환값
        return ResponseDto.setSuccess("회원가입 성공", null);
    }

    // [로그인]
    public ResponseDto<SignInResponseDto> signIn(SignInDto dto) {
        String userEmail = dto.getUserEmail();
        String userPassword = dto.getUserPassword();
        UserEntity userEntity = null;

        try {
            userEntity = userRepository.findByUserEmail(userEmail);

            // [로그인] 존재하지 않는 이메일
            if (userEntity == null) {
                return ResponseDto.setFail("noExistEmail");
            }

            // [로그인] 잘못된 비밀번호
            if (!passwordEncoder.matches(userPassword, userEntity.getUserPassword())) {
                // [로그인] 탈퇴된 회원
                if (userEntity.getDeleteDate() != null) {
                    return ResponseDto.setFail("deletedUser");
                }
                return ResponseDto.setFail("wrongPassword");
            }

        } catch (Exception error) {
            return ResponseDto.setFail("데이터베이스 에러");
        }

        userEntity.setUserPassword("");

        // 엑세스 토큰 생성
        Authentication authentication = new UsernamePasswordAuthenticationToken(new PrincipalDetails(userEntity), null, null);
        String accessToken = jwtTokenProvider.create(authentication);
        int exprTime = 3600000; // 엑세스 토큰 만료 시간 (1시간)
        System.out.println("액세스 토큰 생성!" + accessToken);

        // 리프레시 토큰 생성
        String refreshToken = generateRefreshToken();
        jwtTokenProvider.saveRefreshToken(String.valueOf(userEntity.getUserCd()), refreshToken);
        System.out.println("리프레시 토큰!" + refreshToken);

        SignInResponseDto signInResponseDto = new SignInResponseDto(accessToken, exprTime, userEntity);

        return ResponseDto.setSuccess("로그인 성공", signInResponseDto);
    }

    // 리프레시 토큰 생성
    private String generateRefreshToken() {
        char[] charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".toCharArray();
        StringBuilder refreshTokenBuilder = new StringBuilder();

        for (int i = 0; i < 32; i++) {
            int randomIdx = (int) (Math.random() * charSet.length);
            refreshTokenBuilder.append(charSet[randomIdx]);
        }
        if(refreshTokenBuilder.toString() != null) System.out.println("리프레시 토큰 생성!");
        return refreshTokenBuilder.toString();
    }

    // [이메일 중복 검사]
    public boolean emailCheck(EmailCheckDto dto) {
        String userEmail = dto.getUserEmail();
        try {
            if (userRepository.existsByUserEmail(userEmail)) {
                // System.out.println("이메일 중복 : 중복");
                return false;
            }
        } catch (Exception error) {
            ResponseDto.setFail("데이터베이스 에러");
        }
        // System.out.println("이메일 중복 : 통과");
        return true;
    }

    // [임시 비밀번호]
    public MailDto createTempPassword(String userEmail) {
        MailDto dto = new MailDto();
        String tempPassword = getTempPassword();
        dto.setUserEmail(userEmail);
        dto.setTitle("[릴리뷰] 새로운 비밀번호를 설정해주세요.");
        dto.setMessage("[" + userEmail + "]" + " 회원님의 임시 비밀번호는 " + tempPassword + " 입니다.");
        updateUserPassword(tempPassword, userEmail);
        return dto;
    }

    // [임시 비밀번호] 10자리 랜덤 난수 생성
    public String getTempPassword() {
        char[] charSet = new char[]{'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
                'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'};
        int idx = 0;
        String tempPassword = "";
        for (int i = 0; i < 10; i++) {
            idx = (int) (charSet.length * Math.random());
            tempPassword += charSet[idx];
        }
        return tempPassword;
    }

    // [임시 비밀번호] 임시 비밀번호 저장
    public void updateUserPassword(String tempPassword, String userEmail) {
        String userPassword = passwordEncoder.encode(tempPassword);
        UserEntity userEntity = userRepository.findByUserEmail(userEmail);
        userEntity.setUserPassword(userPassword);
        userRepository.save(userEntity);
        // System.out.println("변경 전 난수 : " + tempPassword);
        // System.out.println("변경 비밀번호 : " + userPassword);
    }

    // [임시 비밀번호] 임시 비밀번호 메일 발송
    public void sendMail(MailDto dto) {
        // System.out.println("임시 비밀번호 발급 완료!");
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(dto.getUserEmail());
        message.setSubject(dto.getTitle());
        message.setText(dto.getMessage());
        mailSender.send(message);
    }

    // [플랫폼 검사]
    public String providerCheck(UserEntity requestBody) {
        // System.out.println("유저 이메일 : " + requestBody.getUserEmail());
        UserEntity userEntity = userRepository.findByUserEmail(requestBody.getUserEmail());

        if (userEntity == null) {
            // System.out.println("[플랫폼 검사] : 유저 이메일이 존재하지 않습니다.");
            return "noExistEmail";
        } else {
            Date result1 = userEntity.getDeleteDate();
            String result2 = userEntity.getProvider();
            // System.out.println("회원 탈퇴일 검사 결과 : " + result1);
            // System.out.println("플랫폼 검사 결과 : " + result2);

            if (result1 == null) { // 가입회원
                if (result2 == null) {
                    // System.out.println("[플랫폼 검사] : 일반 로그인 회원입니다.");
                    return "emailProviderPass";
                } else {
                    // System.out.println("[플랫폼 검사] : 소셜 로그인 회원입니다.");
                    return "existProvider";
                }
            } else { // 탈퇴회원
                // System.out.println("[플랫폼 검사] : 탈퇴 회원입니다.");
                return "deletedUser";
            }
        }
    }

    // [비밀번호 변경]
    public boolean changePassword(UserEntity requestBody) {
        // System.out.println("비밀번호 변경 정보: " + requestBody);
        String encodedPassword = passwordEncoder.encode(requestBody.getUserPassword());
        UserEntity userEntity = userRepository.findByUserEmail(requestBody.getUserEmail());
        userEntity.setUserPassword(encodedPassword);

        try {
            userRepository.save(userEntity);
            // System.out.println("비밀번호 변경 성공!");
            return true;
        } catch (Exception error) {
            return false;
        }
    }

    // [회원탈퇴]
    public void updateDeleteDate(String userEmail) {
        UserEntity userEntity = userRepository.findByUserEmail(userEmail);
        if (userEntity != null) {
            userEntity.setDeleteDate(new Timestamp(System.currentTimeMillis()));    // 회원탈퇴 날짜 저장
            userEntity.setUsername(null);
            userEntity.setUserPassword(null);
            userEntity.setRole(null);
            userEntity.setProvider(null);
            userEntity.setProviderCd(null);
            userRepository.save(userEntity);
            // System.out.println("회원탈퇴 완료!");
        } else {
            // System.out.println("회원을 찾을 수 없습니다!");
        }
    }

    // [프로필] userCd를 통해 userEntity 조회 (J)
    public UserEntity getUserByUserCd(int userCd) {
        return userRepository.findByUserCd(userCd);
    }
}