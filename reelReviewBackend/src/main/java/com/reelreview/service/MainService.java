package com.reelreview.service;

import com.reelreview.api.domain.*;
import com.reelreview.api.repo.*;
import com.reelreview.api.service.ApiDataUnwrap;
import com.reelreview.api.service.TMDBMovieDataManager;
import com.reelreview.domain.*;
import com.reelreview.repository.*;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MainService {
    @Autowired
    private ApiMovieDetailRepo movieDetailRepo;
    @Autowired
    private ApiMovieUpcommingRepo mUpcomming;
    @Autowired
    private ApiMovieVideosRepo movieVideosRepo;
    @Autowired
    private ApiMovieImagesRepo movieImagesRepo;
    @Autowired
    private ApiMovieGenresRepo movieGenresRepo;
    @Autowired
    private CastDataRepository castDataRepo;
    @Autowired
    private CrewDataRepository crewDataRepo;
    @Autowired
    private DirectorMovieRepository directorMovieRepo;
    @Autowired
    private ActorMovieRepository actorMovieRepo;
    @Autowired
    private TodayGenreRepository todayGenreRepo;
    @Autowired
    private RatingDataRepository ratingDataRepo;
    public List<MovieDetailsDTO> getBoxOfficeToday() {
        List<Integer> ranky = new ArrayList<>();
        for(int i = 1 ; i < 11 ; i++){
            ranky.add(i);
        }
        List<MovieDetailsDTO> todaylist =  movieDetailRepo.findByRankIn(ranky);
        return todaylist;
    }
    public static String getCurrentDateInStringFormat() {
        LocalDate currentDate = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        return currentDate.format(formatter);
    }

    public List<MovieUpcommingDTO> getUpcommingToday() {

        List<MovieUpcommingDTO> upcommingList = mUpcomming.findByUpcommingDownloadDate(getCurrentDateInStringFormat());
        return upcommingList;
    }

    public List<MovieDetailsDTO> getMovieListFromDirector(String name) throws IOException, InterruptedException, ParseException {
        String query = URLEncoder.encode(name,"UTF-8");
        System.out.println(query);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.themoviedb.org/3/search/person?query="+query+"&include_adult=false&language=ko"))
                .header("accept", "application/json")
                .header("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZmZhYTU1NDc2ZTRjYTdjNzI3Nzg4ZjlmOTMwZDY0NCIsInN1YiI6IjY0OTk0OWQ1NjJmMzM1MDEyNzQ3MzI2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FiFcp5Wrby8LZtoc_h9tQ2v6yOKyKwO2B8pqzavLsW0")
                .method("GET", HttpRequest.BodyPublishers.noBody())
                .build();
        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        JSONParser parser = new JSONParser();
        Object obj = parser.parse(response.body());
        System.out.println(obj);
        JSONObject jobj = (JSONObject) obj;
        JSONArray jary = (JSONArray) jobj.get("results");
        //임시로 0번만
        JSONObject data = (JSONObject) jary.get(0);
        Long personId = (Long)data.get("id");


        // 인물 아이디로 검색해서 리스트받아오기

        HttpRequest request2 = HttpRequest.newBuilder()
                .uri(URI.create("https://api.themoviedb.org/3/person/"+personId+"/movie_credits?language=ko"))
                .header("accept", "application/json")
                .header("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZmZhYTU1NDc2ZTRjYTdjNzI3Nzg4ZjlmOTMwZDY0NCIsInN1YiI6IjY0OTk0OWQ1NjJmMzM1MDEyNzQ3MzI2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FiFcp5Wrby8LZtoc_h9tQ2v6yOKyKwO2B8pqzavLsW0")
                .method("GET", HttpRequest.BodyPublishers.noBody())
                .build();
        HttpResponse<String> response2 = HttpClient.newHttpClient().send(request2, HttpResponse.BodyHandlers.ofString());
        Object obj2 = parser.parse(response2.body());
        JSONObject jobj2 = (JSONObject) obj2;
        JSONArray jary2 = (JSONArray) jobj2.get("crew");
        List<MovieDetailsDTO> directorSearchDataList = new ArrayList<>();
        List<Integer> movieIds = new ArrayList<>();
        ApiDataUnwrap apiDataUnwrap = new ApiDataUnwrap();

        TMDBMovieDataManager TDM = new TMDBMovieDataManager();

        for(int i = 0 ; i < jary2.size() ; i++){
            JSONObject moviesSearchByDirector = (JSONObject)jary2.get(i);
            TMDBMovieDataManager t = new TMDBMovieDataManager();
            JSONObject jData = t.TMDBMovieJsonObjectToNeededDataJsonObject(moviesSearchByDirector);
            MovieDetailsDTO m = t.JSONObjectToMovieDetailsDTO(jData);
            DirectorMovieDTO d = t.movieDetailsToDirectorMovieDTO(m,name,Integer.valueOf(String.valueOf(personId)));
            directorMovieRepo.save(d);

            if(!movieDetailRepo.existsById(m.getMovieId())){
                movieDetailRepo.save(m);
            }
            boolean isDuplicate = false;
            for (int j = 0; j < directorSearchDataList.size(); j++) {
                if (directorSearchDataList.get(j).equals(m)) {
                    isDuplicate = true;
                    break;
                }
            }
            if (!isDuplicate) {
                directorSearchDataList.add(m);
            }
            movieIds.add(m.getMovieId());
        }


        JSONArray fulldata = apiDataUnwrap.searchFromTMDBWithMovieId(movieIds);
        JSONArray imageData = apiDataUnwrap.searchFromTMDBImagesWithMovieId(movieIds);

        for(Object movie : fulldata){
            JSONObject joject = (JSONObject)movie;
            ActorMovieDTO d = TDM.movieDetailsToActorMovieDTO(TDM.JSONObjectToMovieDetailsDTO(joject),name,Integer.valueOf(String.valueOf(personId)));
            actorMovieRepo.save(d);
            if(!movieDetailRepo.existsById(((Long)joject.get("id")).intValue())){
                movieDetailRepo.save(TDM.JSONObjectToMovieDetailsDTO(joject));
            }
            List<MovieVideosDTO> videoData = TDM.getVideoData(joject);
            for (MovieVideosDTO m : videoData){
                movieVideosRepo.save(m);
            }
            // 장르 데이터만 추려서 genreData에 추가하기

            List<MovieGenresDTO> genreDTO = TDM.getGenreData(joject);
            for(MovieGenresDTO m : genreDTO){
                movieGenresRepo.save(m);
            }
            // 영화 참가 배우데이터만 추려서 DTO 저장
            List<CastDataDTO> castDataDTOS = TDM.getCastData(joject);
            for(CastDataDTO m : castDataDTOS){
                castDataRepo.save(m);
            }
            // 영화 참가 관계자 데이터만 추려서 crewData에 추가하기
            List<CrewDataDTO> crewDataDTOS = TDM.getCrewData(joject);
            for(CrewDataDTO m : crewDataDTOS){
                crewDataRepo.save(m);
            }
        }
        for(int i = 0 ; i < imageData.size() ; i++){
            MovieImagesDTO imagesDTO = new MovieImagesDTO();
            JSONObject image = (JSONObject)imageData.get(i) ;
            imagesDTO.setMovieCd(Long.valueOf((Integer)image.get("movieCd")));
            imagesDTO.setBackdropPath((String) image.get("backdropPath"));

            movieImagesRepo.save(imagesDTO);

        }


        Collections.sort(directorSearchDataList, Comparator.comparing(MovieDetailsDTO::getRelease_date).reversed());
        return directorSearchDataList;
    }

    public List<MovieDetailsDTO> getMovieListFromGenre(String genre) {
        List<MovieGenresDTO> list = movieGenresRepo.findByGenreName(genre);
        List<MovieDetailsDTO> listMovie = new ArrayList<>();
        for (int i = 0; i < list.size(); i++) {
            Long movieCd = list.get(i).getMovieCd();
            Optional<MovieDetailsDTO> optionalMovieDetailsDTO = movieDetailRepo.findById(movieCd.intValue());

            // Optional의 값이 존재하면 리스트에 추가
            optionalMovieDetailsDTO.ifPresent(listMovie::add);
        }
        Comparator<MovieDetailsDTO> comparator = Comparator.comparing(MovieDetailsDTO::getRelease_date, Comparator.nullsLast(Comparator.reverseOrder()));
        Collections.sort(listMovie, comparator);
        List<MovieDetailsDTO> finalList = getLimitedList(listMovie,20);

        return finalList;
    }
    private static <E> List<E> getLimitedList(List<E> dataList, int maxSize) {
        int size = dataList.size();
        int fromIndex = Math.max(0, size - maxSize);
        int toIndex = Math.min(size, fromIndex+maxSize);
        return new ArrayList<>(dataList.subList(fromIndex, toIndex));
    }
    public List<MovieDetailsDTO> getMovieListFromActor(String name) throws ParseException, IOException, InterruptedException {
        String query = URLEncoder.encode(name,"UTF-8");
        System.out.println(query);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.themoviedb.org/3/search/person?query="+query+"&include_adult=false&language=ko"))
                .header("accept", "application/json")
                .header("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZmZhYTU1NDc2ZTRjYTdjNzI3Nzg4ZjlmOTMwZDY0NCIsInN1YiI6IjY0OTk0OWQ1NjJmMzM1MDEyNzQ3MzI2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FiFcp5Wrby8LZtoc_h9tQ2v6yOKyKwO2B8pqzavLsW0")
                .method("GET", HttpRequest.BodyPublishers.noBody())
                .build();
        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        JSONParser parser = new JSONParser();
        Object obj = parser.parse(response.body());
        System.out.println(obj);
        JSONObject jobj = (JSONObject) obj;
        JSONArray jary = (JSONArray) jobj.get("results");
        //임시로 0번만
        JSONObject data = (JSONObject) jary.get(0);
        Long personId = (Long)data.get("id");

        // 인물 아이디로 검색해서 리스트받아오기

        HttpRequest request2 = HttpRequest.newBuilder()
                .uri(URI.create("https://api.themoviedb.org/3/person/"+personId+"/movie_credits?language=ko"))
                .header("accept", "application/json")
                .header("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZmZhYTU1NDc2ZTRjYTdjNzI3Nzg4ZjlmOTMwZDY0NCIsInN1YiI6IjY0OTk0OWQ1NjJmMzM1MDEyNzQ3MzI2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FiFcp5Wrby8LZtoc_h9tQ2v6yOKyKwO2B8pqzavLsW0")
                .method("GET", HttpRequest.BodyPublishers.noBody())
                .build();
        HttpResponse<String> response2 = HttpClient.newHttpClient().send(request2, HttpResponse.BodyHandlers.ofString());
        Object obj2 = parser.parse(response2.body());
        System.out.println(obj2);
        JSONObject jobj2 = (JSONObject) obj2;
        JSONArray jary2 = (JSONArray) jobj2.get("cast");
        List<MovieDetailsDTO> actorSearchDataList = new ArrayList<>();

        List<Integer> movieIds = new ArrayList<>();
        ApiDataUnwrap apiDataUnwrap = new ApiDataUnwrap();

        TMDBMovieDataManager TDM = new TMDBMovieDataManager();
        for(int i = 0 ; i < jary2.size() ; i++) {
            JSONObject moviesSearchByActor = (JSONObject) jary2.get(i);
            JSONObject jData = TDM.TMDBMovieJsonObjectToNeededDataJsonObject(moviesSearchByActor);
            MovieDetailsDTO m = TDM.JSONObjectToMovieDetailsDTO(jData);
            boolean isDuplicate = false;
            for (int j = 0; j < actorSearchDataList.size(); j++) {
                if (actorSearchDataList.get(j).equals(m)) {
                    isDuplicate = true;
                    break;
                }
            }
            if (!isDuplicate) {
                actorSearchDataList.add(m);
            }
            movieIds.add(m.getMovieId());
        }

        JSONArray fulldata = apiDataUnwrap.searchFromTMDBWithMovieId(movieIds);
        JSONArray imageData = apiDataUnwrap.searchFromTMDBImagesWithMovieId(movieIds);

        for(Object movie : fulldata){
            JSONObject joject = (JSONObject)movie;
            ActorMovieDTO d = TDM.movieDetailsToActorMovieDTO(TDM.JSONObjectToMovieDetailsDTO(joject),name,Integer.valueOf(String.valueOf(personId)));
            actorMovieRepo.save(d);
            if(!movieDetailRepo.existsById(((Long)joject.get("id")).intValue())){
                movieDetailRepo.save(TDM.JSONObjectToMovieDetailsDTO(joject));
            }
            List<MovieVideosDTO> videoData = TDM.getVideoData(joject);
            for (MovieVideosDTO m : videoData){
                movieVideosRepo.save(m);
            }
            // 장르 데이터만 추려서 genreData에 추가하기

            List<MovieGenresDTO> genreDTO = TDM.getGenreData(joject);
            for(MovieGenresDTO m : genreDTO){
                movieGenresRepo.save(m);
            }
            // 영화 참가 배우데이터만 추려서 DTO 저장
            List<CastDataDTO> castDataDTOS = TDM.getCastData(joject);
            for(CastDataDTO m : castDataDTOS){
                castDataRepo.save(m);
            }
            // 영화 참가 관계자 데이터만 추려서 crewData에 추가하기
            List<CrewDataDTO> crewDataDTOS = TDM.getCrewData(joject);
            for(CrewDataDTO m : crewDataDTOS){
                crewDataRepo.save(m);
            }
        }
        for(int i = 0 ; i < imageData.size() ; i++){
            MovieImagesDTO imagesDTO = new MovieImagesDTO();
            JSONObject image = (JSONObject)imageData.get(i) ;
            imagesDTO.setMovieCd(Long.valueOf((Integer)image.get("movieCd")));
            imagesDTO.setBackdropPath((String) image.get("backdropPath"));

            movieImagesRepo.save(imagesDTO);

        }

        Collections.sort(actorSearchDataList, Comparator.comparing(MovieDetailsDTO::getRelease_date).reversed());
        return actorSearchDataList;
    }


    @Transactional
    public List<MovieDetailsDTO> getMovieListFromTitle(String title) {
        List<MovieDetailsDTO> m = movieDetailRepo.findByTitleContaining(title);

        return m;
    }

    public JSONObject getTodayTypeMovies(LocalDate l) {
        List<DirectorMovieDTO> d = directorMovieRepo.findByDirectorDownDate(l.toString());
        List<ActorMovieDTO> a = actorMovieRepo.findByActorDownDate(l.toString());
        Optional<TodayGenreDTO> tgd = todayGenreRepo.findById(l.toString());
        List<MovieDetailsDTO> g = getMovieListFromGenre(tgd.orElseThrow().getGenreName());
        List<RatingDataDto> ratingList = ratingDataRepo.findAll();
        int number = ratingList.size();
        JSONObject j = new JSONObject();
        d.removeIf(movie -> movie.getRelease_date() == null);
        g.removeIf(movie -> movie.getRelease_date() == null);
        a.removeIf(movie -> movie.getRelease_date() == null);
        Collections.sort(d, Comparator.comparing(DirectorMovieDTO::getRelease_date).reversed());
        Collections.sort(g, Comparator.comparing(MovieDetailsDTO::getRelease_date).reversed());
        Collections.sort(a, Comparator.comparing(ActorMovieDTO::getRelease_date).reversed());
        d = d.stream().limit(20).collect(Collectors.toList());
        a = a.stream().limit(20).collect(Collectors.toList());
        g = g.stream().limit(20).collect(Collectors.toList());
        j.put("director",d);
        j.put("actor",a);
        j.put("genre",g);
        j.put("todayGenre",tgd.orElseThrow().getGenreName());
        j.put("number",number);

        return j;
    }

    public void saveTodayGenre(String genre) {
        TodayGenreDTO tgd = new TodayGenreDTO();
        tgd.setGenreName(genre);
        LocalDate l = LocalDate.now();
        tgd.setTodayDate(l.toString());
        todayGenreRepo.save(tgd);
    }

    public void clearDirectorsearch() {
        directorMovieRepo.deleteAll();
    }

    public void clearActorsearch() {
        actorMovieRepo.deleteAll();
    }

    public void clearGenresearch() {
        todayGenreRepo.deleteAll();
    }
}
