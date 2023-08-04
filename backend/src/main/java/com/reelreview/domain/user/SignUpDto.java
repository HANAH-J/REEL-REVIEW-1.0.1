package com.reelreview.domain.user;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.Column;
import javax.validation.constraints.Pattern;
import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignUpDto {

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

    @Column(columnDefinition = "VARCHAR2(10 CHAR) DEFAULT 'ROLE_USER'")
    private String role; // ROLE_USER, ROLE_ADMIN
    private String provider;
    private String providerCd;

    @CreationTimestamp
    private Timestamp createDate;
    private Timestamp deleteDate;

    public SignUpDto(String userEmail, String username, String userPassword, String role, String provider, String providerCd, Timestamp createDate, Timestamp deleteDate) {
        this.username = username;
        this.userEmail = userEmail;
        this.userPassword = userPassword;
        this.role = role;
        this.provider = provider;
        this.providerCd = providerCd;
        this.createDate = createDate;
        this.deleteDate = deleteDate;
    }
}