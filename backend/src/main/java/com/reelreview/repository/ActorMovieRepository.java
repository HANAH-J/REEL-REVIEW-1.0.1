package com.reelreview.repository;

import com.nimbusds.oauth2.sdk.id.Actor;
import com.reelreview.domain.ActorMovieDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActorMovieRepository extends JpaRepository<ActorMovieDTO , Integer> {

    List<ActorMovieDTO> findByActorDownDate(String string);
}
