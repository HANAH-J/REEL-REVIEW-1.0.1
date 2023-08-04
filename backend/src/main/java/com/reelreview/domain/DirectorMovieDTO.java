package com.reelreview.domain;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
@Entity
@Table(name = "tbl_directorMovies")
@Data
public class DirectorMovieDTO {

        @Id
        private Integer movieId;
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
        private String directorDownDate;
        private String directorName;
        private int directorCd;


}
