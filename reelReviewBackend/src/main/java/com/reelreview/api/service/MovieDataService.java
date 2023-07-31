package com.reelreview.api.service;


import com.reelreview.api.domain.*;
import com.reelreview.api.repo.*;
import com.reelreview.domain.CastDataDTO;
import com.reelreview.domain.CrewDataDTO;
import com.reelreview.repository.CastDataRepository;
import com.reelreview.repository.CrewDataRepository;
import kr.or.kobis.kobisopenapi.consumer.rest.KobisOpenAPIRestService;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.text.DecimalFormat;
import org.json.simple.parser.ParseException;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MovieDataService{

    @Autowired
    private ApiMovieUpcommingRepo movieUpcommingRepo;
    @Autowired
    private ApiMovieDetailRepo movieDetailRepo;
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
    public void getBoxOfficeToday() throws ParseException, IOException, InterruptedException {

        ApiDataUnwrap unwrap = new ApiDataUnwrap();

        // 한국 영화 진흥원 박스오피스 데이터 받아오기
        String key = "a0976f286b811f00895569b8ceab2459";
        KobisOpenAPIRestService service = new KobisOpenAPIRestService(key);
        String todayBoxOffice;
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String formattedDate = yesterday.format(formatter);

        try {
            todayBoxOffice = service.getDailyBoxOffice(true,""+formattedDate,"20",null,null,null);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        // todayBoxOffice == 한국영화진흥원에서 받아온 데이터

        List<String> krdbTitle = unwrap.unWrapKrdbTitle(todayBoxOffice);
        List<String> krdbDate = unwrap.unWrapKrdbDate(todayBoxOffice);

        List<Integer> movieId = new ArrayList<>();

        // 받아온 데이터 포문 돌려서 tmdb에 하나하나 검색
        for(int i = 0; i<krdbTitle.size() ; i++){

            String name = krdbTitle.get(i);
            String date = krdbDate.get(i);
            int id = 0;
            if(name.contains(":")){
                name = name.substring(0,name.indexOf(":"));
            }
            System.out.println(name);

            String query = URLEncoder.encode(name,"UTF-8");

            // tmdb 한글 쿼리화 후 영화 제목으로 검색
            String fullUri = "https://api.themoviedb.org/3/search/movie?query="+query+"&include_adult=true&language=ko&page=1&region=KR";
            // tmdb api 접속 데이터 받아오기
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(fullUri))
                    .header("accept", "application/json")
                    .header("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZmZhYTU1NDc2ZTRjYTdjNzI3Nzg4ZjlmOTMwZDY0NCIsInN1YiI6IjY0OTk0OWQ1NjJmMzM1MDEyNzQ3MzI2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FiFcp5Wrby8LZtoc_h9tQ2v6yOKyKwO2B8pqzavLsW0")
                    .method("GET", HttpRequest.BodyPublishers.noBody())
                    .build();
            HttpResponse<String> response = null;
            try {
                response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
            } catch (IOException e) {
                throw new RuntimeException(e);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }

            //response.body() = tmdb에서 영화 제목 검색 후 받아온 영화 데이터
            JSONParser parser = new JSONParser();
            Object obj = parser.parse(response.body());
            JSONObject jsonMain = (JSONObject)obj;
            JSONArray jArray = (JSONArray)jsonMain.get("results");
            if(jArray.size()==0){
                continue;
            }
            // tmdb 검색해 받아온 목록 중 영화 개봉일 매칭 후 영화 ID 값만 불러와 LIST 로 저장
            id = unwrap.matchReleaseDateWithTMDBKRDB(response.body(),date,name);

            movieId.add(id);
        }

        //movieId 리스트 받아서 TMDB에 검색
        JSONArray fullData = unwrap.searchFromTMDBWithMovieId(movieId);



        //movieId 리스트 받아서 TMDB에 이미지검색
        JSONArray imageData = unwrap.searchFromTMDBImagesWithMovieId(movieId);

        //KRDB 에서 rank, salesShare,audiAcc 만남기고 제거
        JSONArray KrdbBoxOfficeData = unwrap.unWrapKrdb(todayBoxOffice);

        // 각각 정리된 데이터 포문 돌려서 합치기
        for(int i = 0 ; i < fullData.size() ; i++){
            JSONObject tmdb = (JSONObject)fullData.get(i);
            JSONObject krdb = (JSONObject)KrdbBoxOfficeData.get(i);
            tmdb.put("rank",krdb.get("rank"));
            tmdb.put("salesShare",krdb.get("salesShare"));

            // KRDB 관객수 만단위로 쪼개서 데이터에 추가
            int audi = Integer.parseInt(""+krdb.get("audiAcc"));
            double roundedNumber = Math.round(audi / 100) / 100.0;
            DecimalFormat formatter1 = new DecimalFormat("#,###.0");
            String formattedNumber = formatter1.format(roundedNumber);

            tmdb.put("audiAcc",formattedNumber);
            TMDBMovieDataManager tdm = new TMDBMovieDataManager();

            // 비디오 데이터만 추려서 DTO 저장
            List<MovieVideosDTO> videoData = tdm.getVideoData(tmdb);
            for(MovieVideosDTO m : videoData) {
                movieVideosRepo.save(m);
            }
            // 장르 데이터만 추려서 genreData에 추가하기

            List<MovieGenresDTO> genreDTO = tdm.getGenreData(tmdb);
            for(MovieGenresDTO m : genreDTO){
                movieGenresRepo.save(m);
            }


            // 영화 참가 배우데이터만 추려서 DTO 저장

            List<CastDataDTO> castDataDTOS = tdm.getCastData(tmdb);
            for(CastDataDTO m : castDataDTOS){
                castDataRepo.save(m);
            }

            // 영화 참가 관계자 데이터만 추려서 crewData에 추가하기
            List<CrewDataDTO> crewDataDTOS = tdm.getCrewData(tmdb);
            for(CrewDataDTO m : crewDataDTOS){
                crewDataRepo.save(m);
            }



        }


        //imageDTO 저장
        for(int i = 0 ; i < imageData.size() ; i++){
            MovieImagesDTO imagesDTO = new MovieImagesDTO();
            JSONObject data = (JSONObject)imageData.get(i) ;
            imagesDTO.setMovieCd(Long.valueOf((Integer)data.get("movieCd")));
            imagesDTO.setBackdropPath((String) data.get("backdropPath"));

            movieImagesRepo.save(imagesDTO);

        }






        // DetailDTO 저장
        for(int i = 0 ; i < fullData.size() ; i++){
            MovieDetailsDTO detailsDTO = new MovieDetailsDTO();

            JSONObject jobj = (JSONObject) fullData.get(i);

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

            //랭크데이터/ 퍼센트 데이터/ 누적관객 데이터
            detailsDTO.setRank((Integer.parseInt((String) jobj.get("rank"))));
            detailsDTO.setSalesShare(Double.parseDouble((String)jobj.get("salesShare")));
            detailsDTO.setAudiAcc(((String)jobj.get("audiAcc")));


            movieDetailRepo.save(detailsDTO);
        }



        // 개봉예정작 데이터 받고 저장

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.themoviedb.org/3/movie/upcoming?language=ko&region=KR"))
                    .header("accept", "application/json")
                    .header("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZmZhYTU1NDc2ZTRjYTdjNzI3Nzg4ZjlmOTMwZDY0NCIsInN1YiI6IjY0OTk0OWQ1NjJmMzM1MDEyNzQ3MzI2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FiFcp5Wrby8LZtoc_h9tQ2v6yOKyKwO2B8pqzavLsW0")
                    .method("GET", HttpRequest.BodyPublishers.noBody())
                    .build();
            HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());



            JSONParser parser = new JSONParser();
            Object obj = parser.parse(response.body());
            JSONObject jsonMain = (JSONObject)obj;
            JSONArray jArray = (JSONArray)jsonMain.get("results");


            for(int i = 0 ; i < jArray.size() ; i++){
                MovieUpcommingDTO upcommingDTO = new MovieUpcommingDTO();
                MovieDetailsDTO detailsDTO = new MovieDetailsDTO();


                JSONObject jobj = new JSONObject();
                jobj = (JSONObject) jArray.get(i);

                upcommingDTO.setMovieId((Long)jobj.get("id"));
                upcommingDTO.setOriginal_language((String) jobj.get("original_language"));
                upcommingDTO.setOriginal_title((String) jobj.get("original_title"));
                upcommingDTO.setOverview((String) jobj.get("overview"));
                upcommingDTO.setPoster_path((String) jobj.get("poster_path"));
                upcommingDTO.setRelease_date((String) jobj.get("release_date"));
                upcommingDTO.setRuntime((Long)jobj.get("runtime"));
                upcommingDTO.setTagline((String) jobj.get("tagline"));
                upcommingDTO.setTitle((String) jobj.get("title"));
                upcommingDTO.setVote_average(Double.parseDouble(""+jobj.get("vote_average")));
                upcommingDTO.setVote_count((Long) jobj.get("vote_count"));

                String formattedDate4 = getCurrentDateInStringFormat();
                upcommingDTO.setUpcommingDownloadDate(formattedDate4);
                //디테일 DTO 에 저장
                detailsDTO.setMovieId(Math.toIntExact((Long) jobj.get("id")));
                detailsDTO.setTagline((String) jobj.get("tagline"));
                detailsDTO.setRuntime((Long) jobj.get("runtime"));
                detailsDTO.setTitle((String) jobj.get("title"));
                detailsDTO.setOverview((String) jobj.get("overview"));
                detailsDTO.setOriginal_language((String) jobj.get("original_language"));
                detailsDTO.setOriginal_title((String) jobj.get("original_title"));
                detailsDTO.setPoster_path((String) jobj.get("poster_path"));
                detailsDTO.setRelease_date((String) jobj.get("release_date"));
                detailsDTO.setVote_count((Long) jobj.get("vote_count"));
                detailsDTO.setVote_average(Double.valueOf(jobj.get("vote_average").toString()));
                movieUpcommingRepo.save(upcommingDTO);
                movieDetailRepo.save(detailsDTO);
            }

    }
    public static String getCurrentDateInStringFormat() {
        LocalDate currentDate = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        return currentDate.format(formatter);
    }

    @Transactional
    public List<MovieDetailsDTO> changeRanktoNull() {
        List<Integer> rank = new ArrayList<>();
        for(int i = 1; i < 11 ; i++) {
            rank.add(i);
        }
        List<MovieDetailsDTO> inRank = movieDetailRepo.findByRankIn(rank);

        for(int i = 0 ; i < inRank.size() ; i++) {
            inRank.get(i).setRank(null);
            inRank.get(i).setSalesShare(null);
            movieDetailRepo.save(inRank.get(i));
        }


        return inRank;
    }


    public MovieDetailsDTO getMovieByMovieId(int movieId) {
        Optional<MovieDetailsDTO> movieDetailsOptional = movieDetailRepo.findById(movieId);

        if (movieDetailsOptional.isPresent()) {
            return movieDetailsOptional.get(); // 영화 정보 반환
        } else {
            return null;
        }
    }

}
