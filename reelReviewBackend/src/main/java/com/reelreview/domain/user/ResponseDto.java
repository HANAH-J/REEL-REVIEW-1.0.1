package com.reelreview.domain.user;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor(staticName = "set")
public class ResponseDto<D> {
    private boolean result;
    private String message;
    private D data;

    public static <D> ResponseDto<D> setSuccess(String message, D data) {
        // System.out.println("성공");
        return ResponseDto.set(true, message, data);
    }

    public static <D> ResponseDto<D> setFail(String message) {
        // System.out.println("실패");
        return ResponseDto.set(false, message, null);
    }
}
