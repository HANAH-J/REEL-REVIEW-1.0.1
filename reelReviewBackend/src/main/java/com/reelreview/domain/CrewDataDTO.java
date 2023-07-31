package com.reelreview.domain;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "tbl_crewData")
public class CrewDataDTO {
    @Id
    private String crewId;
    private Long peopleCd;
    private String peopleName;
    private String peopleImage;
    private Long movieCd;
    private String department;
    private String job;

    public void setCrewId(Long peopleCd, Long movieCd) {
        this.crewId = String.valueOf(peopleCd)+" "+String.valueOf(movieCd);
    }
}