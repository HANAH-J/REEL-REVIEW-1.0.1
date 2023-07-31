package com.reelreview.repository;

import com.reelreview.domain.DirectorMovieDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DirectorMovieRepository extends JpaRepository<DirectorMovieDTO , Integer> {
    List<DirectorMovieDTO> findByDirectorDownDate(String downDate);
}
