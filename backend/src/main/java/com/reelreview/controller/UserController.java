package com.reelreview.controller;

import com.reelreview.domain.user.*;
import com.reelreview.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController // 해당 클래스를 Controller(+ ResponseBody)로 인식
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // [회원가입]
    @PostMapping("/signUp")
    public ResponseDto<?> signUp(@RequestBody SignUpDto requestBody) {
        ResponseDto<?> result = userService.signUp(requestBody);
        return result;
    }

    // [이메일 중복 검사]
    @PostMapping("/emailCheck")
    public boolean emailCheck(@RequestBody EmailCheckDto requestBody) {
        boolean result = userService.emailCheck(requestBody);
        System.out.println(result);
        return result;
    }

    // [일반 로그인]
    @PostMapping("/signIn")
    public ResponseDto<SignInResponseDto> signIn(@RequestBody SignInDto requestBody) {
        ResponseDto<SignInResponseDto> result = userService.signIn(requestBody);
        return result;
    }

    // [임시 비밀번호]
    @PostMapping("/resetPw/sendEmail")
    public String sendEmail(@RequestBody EmailCheckDto requestBody) {
        MailDto dto = userService.createTempPassword(requestBody.getUserEmail());
        userService.sendMail(dto);
        return "";
    }

    // [플랫폼 검사]
    @PostMapping("/providerCheck")
    public String providerCheck(@RequestBody UserEntity requestBody) {
        String result = userService.providerCheck(requestBody);
        return result;
    }

    // [비밀번호 변경]
    @PostMapping("/changePw")
    public boolean changePw(@RequestBody UserEntity requestBody) {
        boolean result = userService.changePassword(requestBody);
        return result;
    }

    // [회원탈퇴]
    @PostMapping("/signOutForever")
    public String signOutForever(@RequestBody EmailCheckDto requestBody) {
        String userEmail = String.valueOf(requestBody.getUserEmail());
        // System.out.println("탈퇴 메일 : " + userEmail);
        boolean result = userService.updateDeleteDate(userEmail);
        if(result == true) return "true";
        else return "false";
    }
}