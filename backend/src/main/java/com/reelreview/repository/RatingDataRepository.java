package com.reelreview.repository;

import com.reelreview.domain.RatingDataDto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingDataRepository extends JpaRepository<RatingDataDto,String> {
    List<RatingDataDto> findByUserCd(int userCd);

    List<RatingDataDto> findByMovieId(int movieId);

    RatingDataDto findByMovieIdAndUserCd(int movieId, int userCd);

}
