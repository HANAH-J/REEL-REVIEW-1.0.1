package com.reelreview.api.domain;


import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "tbl_movieVideo")
@SequenceGenerator(
        name = "movieVideo_seq_generator",
        sequenceName = "movieVideo_seq"
)
public class MovieVideosDTO {


    private Long movieCd;
    private String videoName;

    private String videoKey;
    @Id
    private String videoId;
}
