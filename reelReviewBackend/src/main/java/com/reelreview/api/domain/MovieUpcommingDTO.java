package com.reelreview.api.domain;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "tbl_movieUpcomming")
@Data
public class MovieUpcommingDTO {
    @Id
    private Long movieId;
    private String original_language;
    private String original_title;
    @Column(length = 2000)
    private String overview;
    private String poster_path;
    private String release_date;
    private Long runtime;
    private String tagline;
    private String title;
    private Double vote_average;
    private Long vote_count;
    private String upcommingDownloadDate;
}
