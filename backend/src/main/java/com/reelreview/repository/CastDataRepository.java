package com.reelreview.repository;

import com.reelreview.domain.CastDataDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CastDataRepository extends JpaRepository<CastDataDTO,String> {

    List<CastDataDTO> findByMovieCd(Long movieCd);
}
