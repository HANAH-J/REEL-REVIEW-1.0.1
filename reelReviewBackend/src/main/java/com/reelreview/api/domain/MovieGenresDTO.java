package com.reelreview.api.domain;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name= "tbl_movieGenre")
@SequenceGenerator(
        name = "movieGenre_seq_generator",
        sequenceName = "movieGenre_seq"
)
public class MovieGenresDTO {

    @Id
    private String genreIndexId;
    private Long movieCd;
    private Integer genreId;
    private String genreName;

    public void setGenreIndexId(long movieCd,Integer genreId) {
        this.genreIndexId = movieCd+" "+genreId;
    }
}
