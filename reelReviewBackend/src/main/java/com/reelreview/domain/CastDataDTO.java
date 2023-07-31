package com.reelreview.domain;


import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;


@Data
@Entity
@Table(name = "tbl_castData")
public class CastDataDTO {
    @Id
    private String castId;
    private Long peopleCd;
    private String peopleName;
    private String peopleImage;
    private Long movieCd;
    private String character;
    public void setCastId(Long peopleCd, Long movieCd) {
        this.castId = String.valueOf(peopleCd)+" "+String.valueOf(movieCd);
    }

}
