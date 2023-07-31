package com.reelreview.controller;

//import com.reelreview.Service.MainService;
import com.reelreview.api.domain.MovieDetailsDTO;
import com.reelreview.api.domain.MovieUpcommingDTO;
import com.reelreview.api.service.MovieDataService;
import com.reelreview.service.MainService;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
public class MainController {

    @Autowired
    private MainService MS;


    @RequestMapping("api/popular_movielist")
    public List<MovieDetailsDTO> popularMovie(){

         return MS.getBoxOfficeToday();
     }

    @RequestMapping("api/upcomming")
    public List<MovieUpcommingDTO> upcommingMovie(){

        return MS.getUpcommingToday();
    }

    @RequestMapping("api/directorSearch")
    public List<MovieDetailsDTO> directorSearch(@RequestParam String name) throws IOException, InterruptedException, ParseException {
        MS.clearDirectorsearch();
        return MS.getMovieListFromDirector(name);
    }
    @RequestMapping("api/actorSearch")
    public List<MovieDetailsDTO> actorSearch(@RequestParam String name) throws IOException, InterruptedException, ParseException {
        MS.clearActorsearch();
        return MS.getMovieListFromActor(name);
    }

    @RequestMapping("api/genreSearch")
    public List<MovieDetailsDTO> genreSearch(@RequestParam String genre){
        MS.clearGenresearch();
        MS.saveTodayGenre(genre);
        return MS.getMovieListFromGenre(genre);
    }

    @RequestMapping("api/movieSearch")
    public List<MovieDetailsDTO> search(@RequestParam String name) {
        List<MovieDetailsDTO> searchList = MS.getMovieListFromTitle(name);
        System.out.println(searchList);
        return searchList;
    }

    @RequestMapping("api/directorNactorNgenreSearchByDate")
    public JSONObject directorNactorNgenreSearchByDate(){
        LocalDate l = LocalDate.now();
        JSONObject j = MS.getTodayTypeMovies(l);

        return j;
    }










}
