//package com.reelreview.api.service;
//
//
//import com.reelreview.api.domain.MovieUpcommingDTO;
//import com.reelreview.api.repo.ApiMovieUpcommingRepo;
//import org.json.simple.JSONArray;
//import org.json.simple.JSONObject;
//import org.json.simple.parser.JSONParser;
//import org.json.simple.parser.ParseException;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.io.IOException;
//import java.net.URI;
//import java.net.http.HttpClient;
//import java.net.http.HttpRequest;
//import java.net.http.HttpResponse;
//
//@Service
//public class MovieUpcomingService {
//
//    @Autowired
//    private ApiMovieUpcommingRepo movieUpcommingRepo;
//    public String getMovieUpcoming() throws IOException, InterruptedException, ParseException {
//
//        HttpRequest request = HttpRequest.newBuilder()
//                .uri(URI.create("https://api.themoviedb.org/3/movie/upcoming?language=ko&region=KR"))
//                .header("accept", "application/json")
//                .header("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZmZhYTU1NDc2ZTRjYTdjNzI3Nzg4ZjlmOTMwZDY0NCIsInN1YiI6IjY0OTk0OWQ1NjJmMzM1MDEyNzQ3MzI2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FiFcp5Wrby8LZtoc_h9tQ2v6yOKyKwO2B8pqzavLsW0")
//                .method("GET", HttpRequest.BodyPublishers.noBody())
//                .build();
//        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
//
//
//
//        JSONArray movieUpcomming = new JSONArray();
//        JSONParser parser = new JSONParser();
//        Object obj = parser.parse(response.body());
//        JSONObject jsonMain = (JSONObject)obj;
//        JSONArray jArray = (JSONArray)jsonMain.get("results");
//
//        for(int i = 0 ; i < jArray.size() ; i++){
//            MovieUpcommingDTO detailsDTO = new MovieUpcommingDTO();
//
//
//            JSONObject jobj = new JSONObject();
//            jobj = (JSONObject) jArray.get(i);
//
//            detailsDTO.setMovieId((Long)jobj.get("id"));
//            detailsDTO.setOriginal_language((String) jobj.get("original_language"));
//            detailsDTO.setOriginal_title((String) jobj.get("original_title"));
//            detailsDTO.setOverview((String) jobj.get("overview"));
//            detailsDTO.setPoster_path((String) jobj.get("poster_path"));
//            detailsDTO.setRelease_date((String) jobj.get("release_date"));
//            detailsDTO.setRuntime((Long)jobj.get("runtime"));
//            detailsDTO.setTagline((String) jobj.get("tagline"));
//            detailsDTO.setTitle((String) jobj.get("title"));
//            detailsDTO.setVote_average(Double.parseDouble(""+jobj.get("vote_average")));
//            detailsDTO.setVote_count((Long) jobj.get("vote_count"));
//            movieUpcomming.add(jobj);
//            movieUpcommingRepo.save(detailsDTO);
//        }
//
//
//        String movieUpcommingString = movieUpcomming.toString();
//
//
//
//
//        return movieUpcommingString;
//    }
//}
