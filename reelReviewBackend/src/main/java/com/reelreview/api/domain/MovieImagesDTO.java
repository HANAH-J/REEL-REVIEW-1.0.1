package com.reelreview.api.domain;

import lombok.Data;

import javax.persistence.*;


@Entity
@Data
@Table(name = "tbl_movieImage")

public class MovieImagesDTO {


    private Long movieCd;
    @Id
    private String backdropPath;
}
