package com.reelreview.domain.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MailDto {
    private String userEmail;
    private String title;
    private String message;
}
