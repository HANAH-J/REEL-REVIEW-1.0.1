package com.reelreview.repository;

import com.reelreview.domain.CommentDataDto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentDataRepository  extends JpaRepository<CommentDataDto,Integer> {

    List<CommentDataDto> findByMovieId(Integer movieId);

    List<CommentDataDto> findByUserCd(int movieId);

    CommentDataDto findCommentByCommentId(int commentId);
}
