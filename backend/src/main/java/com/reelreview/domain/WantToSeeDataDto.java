package com.reelreview.domain;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "tbl_WantToSeeData")
public class WantToSeeDataDto {
    @Id
    private String wantToSeeId;
    private int userCd;
    private int movieId;

    public void setWantToSeeId(int userCd, int movieId) {
        this.wantToSeeId = String.valueOf(userCd)+" "+String.valueOf(movieId);
    }
}