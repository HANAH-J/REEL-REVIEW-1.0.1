package com.reelreview.domain.board;


import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name = "tbl_board")
public class BoardDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "board_seq")
    @SequenceGenerator(name = "board_seq", sequenceName = "BOARD_SEQ", allocationSize = 1)
    private Integer boardCd;
    private String title;
    private String writer;
    private String content;
    private String filename;
    private String filepath;


    @CreationTimestamp
    private Timestamp regdate;



    @Builder
    public BoardDTO(String title, String writer, String content, Timestamp regdate, String filename, String filepath) {
        this.title = title;
        this.writer = writer;
        this.content = content;
        this.regdate = regdate;
        this.filename = filename;
        this.filepath = filepath;
    }

}
