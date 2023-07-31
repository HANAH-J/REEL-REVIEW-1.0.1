package com.reelreview.api.repo;

import com.reelreview.api.domain.MovieImagesDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApiMovieImagesRepo extends JpaRepository<MovieImagesDTO,String> {
    List<MovieImagesDTO> findByMovieCd(Long movieCd);
}
