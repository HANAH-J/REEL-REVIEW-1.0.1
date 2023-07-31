package com.reelreview.domain.user;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.sql.Timestamp;

@Builder
@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "tbl_user")
public class UserEntity {
    @Id // PRIMARY KEY
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
    @SequenceGenerator(name = "user_seq", sequenceName = "USER_SEQ", allocationSize = 1)
    private int userCd;

    @Pattern(regexp = "^(?=.*[a-zA-Z0-9가-힣])[a-zA-Z0-9가-힣\\s]{1,16}$")
    // 이름 유효성 검사 로직
    // 1자 이상 16자 이하, 영어 또는 숫자 또는 한글 (한글 초성 및 모음은 불가)
    private String username;

    @Pattern(regexp = "^(?:\\w+\\.?)*\\w+@(?:\\w+\\.)+\\w+$")
    // 이메일 유효성 검사 로직
    // 이메일 : ex) 'hana@gmail.com' 형식
    private String userEmail;
    private String userPassword;
    private String role; // ROLE_USER, ROLE_ADMIN
    private String provider;
    private String providerCd;

    @CreationTimestamp
    private Timestamp createDate;
    private Timestamp deleteDate;

    public UserEntity(SignUpDto dto) {
        this.username = dto.getUsername();
        this.userPassword = dto.getUserPassword();
        this.userEmail = dto.getUserEmail();
        this.role = dto.getRole();
        this.provider = dto.getProvider();
        this.providerCd = dto.getProviderCd();
        this.createDate = dto.getCreateDate();
        this.deleteDate = dto.getDeleteDate();
    }
}