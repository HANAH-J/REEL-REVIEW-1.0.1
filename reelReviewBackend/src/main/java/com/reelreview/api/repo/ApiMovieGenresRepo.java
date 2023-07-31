package com.reelreview.api.repo;

import com.reelreview.api.domain.MovieGenresDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApiMovieGenresRepo extends JpaRepository<MovieGenresDTO,Long> {

    List<MovieGenresDTO> findByGenreName(String genre);

    List<MovieGenresDTO> findByMovieCd(Long movieCd);

    @Query("SELECT m.movieCd FROM MovieGenresDTO m WHERE m.genreId = :genres")
    List<Integer> findMovieCdByGenreId(@Param("genres") Integer genres);
}
