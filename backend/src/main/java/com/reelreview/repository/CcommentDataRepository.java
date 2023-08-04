package com.reelreview.repository;

import com.reelreview.domain.CcommentDataDto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CcommentDataRepository extends JpaRepository<CcommentDataDto,Integer> {

    List<CcommentDataDto> findByCommentId(int commentId);
}
