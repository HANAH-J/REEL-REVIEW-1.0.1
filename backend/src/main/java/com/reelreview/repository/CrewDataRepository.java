package com.reelreview.repository;

import com.reelreview.domain.CrewDataDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CrewDataRepository extends JpaRepository<CrewDataDTO,String> {
    List<CrewDataDTO> findByMovieCd(Long movieCd);
}
