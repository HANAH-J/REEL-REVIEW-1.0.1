package com.reelreview.domain;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "tbl_todayGenre")
@Data
public class TodayGenreDTO {
    private String genreName;
    @Id
    private String todayDate;
}
