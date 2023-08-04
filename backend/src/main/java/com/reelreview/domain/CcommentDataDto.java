package com.reelreview.domain;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "tbl_cCommentData")
public class CcommentDataDto {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cComment_seq")
    @SequenceGenerator(name = "cComment_seq", sequenceName = "cComment_seq", allocationSize = 1)
    private int cCommentId;
    private int commentId;
    private int userCd;
    private String userName;
    private String pFImage;
    private String cCommentContent;
    private String cCommentDate;
    private int cCommentGood;
}
