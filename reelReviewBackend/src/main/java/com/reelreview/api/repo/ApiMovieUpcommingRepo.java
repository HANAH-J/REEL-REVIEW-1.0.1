package com.reelreview.api.repo;

import com.reelreview.api.domain.MovieUpcommingDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApiMovieUpcommingRepo extends JpaRepository<MovieUpcommingDTO, Long> {
    List<MovieUpcommingDTO> findByUpcommingDownloadDate(String upcommingdowloadate);
}
