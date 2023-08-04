package com.reelreview.api.service;

import com.reelreview.api.domain.MovieDetailsDTO;
import com.reelreview.api.domain.MovieGenresDTO;
import com.reelreview.api.domain.MovieVideosDTO;
import com.reelreview.domain.ActorMovieDTO;
import com.reelreview.domain.CastDataDTO;
import com.reelreview.domain.CrewDataDTO;
import com.reelreview.domain.DirectorMovieDTO;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


public class TMDBMovieDataManager{
    public JSONObject TMDBMovieJsonObjectToNeededDataJsonObject(JSONObject jsonMain){
        JSONObject tmdbData = new JSONObject();

        tmdbData.put("genres",jsonMain.get("genres"));
        tmdbData.put("id",jsonMain.get("id"));
        tmdbData.put("original_language",jsonMain.get("original_language"));
        tmdbData.put("original_title",jsonMain.get("original_title"));
        tmdbData.put("overview",jsonMain.get("overview"));
        tmdbData.put("poster_path",jsonMain.get("poster_path"));
        tmdbData.put("release_date",jsonMain.get("release_date"));
        tmdbData.put("runtime",jsonMain.get("runtime"));
        tmdbData.put("tagline",jsonMain.get("tagline"));
        tmdbData.put("title",jsonMain.get("title"));
        Double avg = 0.0;
        if(jsonMain.get("vote_average")==null){
            avg = 0.0;
        }else{
            avg = Double.parseDouble(""+jsonMain.get("vote_average"));
        }
        double avgdouble = Math.round(avg*10)/10.0;
        tmdbData.put("vote_average",avgdouble);
        tmdbData.put("vote_count",jsonMain.get("vote_count"));
        tmdbData.put("backdrop_path",jsonMain.get("backdrop_path"));
        tmdbData.put("videos",jsonMain.get("videos"));
        tmdbData.put("credits",jsonMain.get("credits"));

        return tmdbData;
    }

    public MovieDetailsDTO JSONObjectToMovieDetailsDTO(JSONObject jobj){
        MovieDetailsDTO detailsDTO = new MovieDetailsDTO();

        detailsDTO.setMovieId(Integer.parseInt(""+jobj.get("id")) );
        detailsDTO.setOriginal_language((String) jobj.get("original_language"));
        detailsDTO.setOriginal_title((String) jobj.get("original_title"));
        detailsDTO.setOverview((String) jobj.get("overview"));
        detailsDTO.setPoster_path((String) jobj.get("poster_path"));
        detailsDTO.setRelease_date((String) jobj.get("release_date"));
        detailsDTO.setRuntime((Long)jobj.get("runtime"));
        detailsDTO.setTagline((String) jobj.get("tagline"));
        detailsDTO.setTitle((String) jobj.get("title"));
        detailsDTO.setVote_average((Double) jobj.get("vote_average"));
        detailsDTO.setVote_count((Long) jobj.get("vote_count"));

        return detailsDTO;
    }
    //VIDEO DATA 추려서 DTO로 변환
    public List<MovieVideosDTO> getVideoData(JSONObject movieData){
        List<MovieVideosDTO> videoDTOS = new ArrayList<>();

        JSONObject videos = (JSONObject) movieData.get("videos");
        System.out.println(videos);
        JSONArray videoList = (JSONArray)videos.get("results");

        for(Object video : videoList){
            JSONObject singleVideo = (JSONObject) video;
            MovieVideosDTO videosDTO = new MovieVideosDTO();
            videosDTO.setMovieCd((Long)movieData.get("id"));
            videosDTO.setVideoKey((String)singleVideo.get("key"));
            videosDTO.setVideoId((String)singleVideo.get("id"));
            videosDTO.setVideoName((String)singleVideo.get("name"));
            videoDTOS.add(videosDTO);

        }
        return videoDTOS;
    }
    //GENRE DATA 추려서 DTO로 변환
    public List<MovieGenresDTO> getGenreData(JSONObject movieData){
        List<MovieGenresDTO> genresDTOS = new ArrayList<>();

        JSONArray genres = (JSONArray)movieData.get("genres");
        for(Object genre : genres){
            MovieGenresDTO genreDTO = new MovieGenresDTO();
            JSONObject gen = (JSONObject)genre;
            System.out.println(gen);
            genreDTO.setGenreId( ((Long)gen.get("id")).intValue());
            genreDTO.setMovieCd((Long) movieData.get("id"));
            genreDTO.setGenreName((String) gen.get("name"));
            genreDTO.setGenreIndexId((Long)movieData.get("id"),((Long)gen.get("id")).intValue());

            genresDTOS.add(genreDTO);
        }

        return genresDTOS;
    }

    //CAST DATA 추려서 DTO로 변환
    public List<CastDataDTO> getCastData(JSONObject movieData){
        List<CastDataDTO> castDataDTOS = new ArrayList<>();

        JSONObject people = (JSONObject)movieData.get("credits");
        JSONArray cast = (JSONArray) people.get("cast");

        for (Object c : cast){

            CastDataDTO castDto = new CastDataDTO();
            JSONObject castPerson = (JSONObject) c;

            castDto.setMovieCd((Long) movieData.get("id"));
            castDto.setCharacter((String) castPerson.get("character"));
            castDto.setPeopleCd((Long) castPerson.get("id"));
            castDto.setPeopleName((String) castPerson.get("original_name"));
            castDto.setPeopleImage((String) castPerson.get("profile_path"));
            castDto.setCastId((Long) castPerson.get("id"),(Long) movieData.get("id"));
            castDataDTOS.add(castDto);
        }
        return castDataDTOS;
    }

    //CREW DATA 추려서 DTO로 변환
    public List<CrewDataDTO> getCrewData(JSONObject movieData){
        List<CrewDataDTO> crewDataDTOS = new ArrayList<>();
        JSONObject people = (JSONObject)movieData.get("credits");
        JSONArray crew = (JSONArray) people.get("crew");

        for(Object c : crew){
            JSONObject crewPerson = (JSONObject) c;
            if(crewPerson.get("job").equals("Director")){
                CrewDataDTO crewDto = new CrewDataDTO();
                crewDto.setMovieCd((Long) movieData.get("id"));
                crewDto.setJob((String) crewPerson.get("job"));
                crewDto.setDepartment((String) crewPerson.get("department"));
                crewDto.setPeopleCd((Long) crewPerson.get("id"));
                crewDto.setPeopleName((String) crewPerson.get("name"));
                crewDto.setPeopleImage((String) crewPerson.get("profile_path"));
                crewDto.setCrewId((Long) crewPerson.get("id"),(Long) movieData.get("id"));
                crewDataDTOS.add(crewDto);
            }


        }

        return crewDataDTOS;
    }

    public ActorMovieDTO movieDetailsToActorMovieDTO(MovieDetailsDTO m,String actorName, int actorCd){
        ActorMovieDTO a = new ActorMovieDTO();

        a.setActorCd(actorCd);
        a.setActorName(actorName);
        LocalDate l = LocalDate.now();
        a.setActorDownDate(l.toString());

        a.setVote_count(m.getVote_count());
        a.setVote_average(m.getVote_average());
        a.setRelease_date(m.getRelease_date());
        a.setOriginal_language(m.getOriginal_language());
        a.setOriginal_title(m.getOriginal_title());
        a.setPoster_path(m.getPoster_path());
        a.setTitle(m.getTitle());
        a.setTagline(m.getTagline());
        a.setRuntime(m.getRuntime());
        a.setOverview(m.getOverview());
        a.setMovieId(m.getMovieId());
        return a;
    }
    public DirectorMovieDTO movieDetailsToDirectorMovieDTO(MovieDetailsDTO m,String directorName, int directorCd){
        DirectorMovieDTO d = new DirectorMovieDTO();
        d.setDirectorCd(directorCd);
        d.setDirectorName(directorName);
        LocalDate l = LocalDate.now();
        d.setDirectorDownDate(l.toString());

        d.setVote_count(m.getVote_count());
        d.setVote_average(m.getVote_average());
        d.setRelease_date(m.getRelease_date());
        d.setOriginal_language(m.getOriginal_language());
        d.setOriginal_title(m.getOriginal_title());
        d.setPoster_path(m.getPoster_path());
        d.setTitle(m.getTitle());
        d.setTagline(m.getTagline());
        d.setRuntime(m.getRuntime());
        d.setOverview(m.getOverview());
        d.setMovieId(m.getMovieId());

        return d;
    }
}
