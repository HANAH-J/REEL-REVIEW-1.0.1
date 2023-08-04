package com.reelreview.api.repo;

import com.reelreview.api.domain.MovieVideosDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApiMovieVideosRepo extends JpaRepository<MovieVideosDTO,Long> {
    List<MovieVideosDTO> findByMovieCd(Long movieCd);
}
