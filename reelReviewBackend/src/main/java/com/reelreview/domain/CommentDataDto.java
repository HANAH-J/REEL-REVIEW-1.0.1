package com.reelreview.domain;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "tbl_commentData")
public class CommentDataDto {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "comment_seq")
    @SequenceGenerator(name = "comment_seq", sequenceName = "comment_seq", allocationSize = 1)
    private int commentId;
    private int movieId;
    private int userCd;
    private String commentContent;
    private String commentDate;
    private int commentGood;
    private int cCommentcount;
    private String userName;
}
