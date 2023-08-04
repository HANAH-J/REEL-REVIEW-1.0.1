package com.reelreview.repository;

import com.reelreview.domain.WantToSeeDataDto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WantToSeeDataRepository extends JpaRepository<WantToSeeDataDto,String> {
    List<WantToSeeDataDto> findByUserCd(int userCd);

    WantToSeeDataDto findByUserCdAndMovieId(int userCd, int movieId);
}
