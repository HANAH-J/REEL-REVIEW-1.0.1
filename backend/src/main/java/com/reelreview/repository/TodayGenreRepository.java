package com.reelreview.repository;

import com.reelreview.domain.TodayGenreDTO;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodayGenreRepository extends JpaRepository<TodayGenreDTO,String> {

}
