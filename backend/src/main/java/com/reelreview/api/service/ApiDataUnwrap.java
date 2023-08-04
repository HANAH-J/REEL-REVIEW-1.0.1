package com.reelreview.api.service;

import com.reelreview.api.domain.MovieDetailsDTO;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ApiDataUnwrap {

    //============================================= TMDB API JSON 분해 ============================================
//    public static List<String> unWrapTmdbImages(String json) throws ParseException {
//        JSONParser parser = new JSONParser();
//        Object obj = parser.parse(json);
//        JSONObject jsonMain = (JSONObject)obj;
//        JSONArray jArray = (JSONArray)jsonMain.get("results");
//
//        List<String> tmdbImages = new ArrayList<>();
//
//        if (jArray.size() > 0){
//            for(int i=0; i<jArray.size(); i++){
//                JSONObject jsonObj = (JSONObject)jArray.get(i);
//
//                tmdbImages.add((String)jsonObj.get("poster_path"));
//            }
//        }
//        return tmdbImages;
//    }


//    public static List<String> unWrapTmdbTitles(String json) throws ParseException {
//        JSONParser parser = new JSONParser();
//        Object obj = parser.parse(json);
//        JSONObject jsonMain = (JSONObject)obj;
//        JSONArray jArray = (JSONArray)jsonMain.get("results");
//
//        List<String> tmdbTitle = new ArrayList<>();
//
//        if (jArray.size() > 0){
//            for(int i=0; i<jArray.size(); i++){
//                JSONObject jsonObj = (JSONObject)jArray.get(i);
//
//                tmdbTitle.add((String)jsonObj.get("title"));
//            }
//        }
//        return tmdbTitle;
//    }

    // TMDB 검색 데이터와 KRDB 날짜 매칭 메서드
    public static int matchReleaseDateWithTMDBKRDB(String json, String KRDBDate, String KRDBName) throws ParseException {
        JSONParser parser = new JSONParser();
        Object obj = parser.parse(json);
        JSONObject jsonMain = (JSONObject)obj;
        JSONArray jArray = (JSONArray)jsonMain.get("results");

        int id = 0;
        List<JSONObject> topTen = new ArrayList<>();
        //검색 결과 매칭이 하나이상일때 출시일 비교
        if (jArray.size() > 1){
            for(int i=0; i<jArray.size(); i++){
                JSONObject jsonObj = (JSONObject)jArray.get(i);
                System.out.println("TMDB 출시일"+jsonObj.get("release_date")+"  KRDB 출시일"+KRDBDate );
                String TMDBDate = ""+jsonObj.get("release_date");
                String TMDBDateYear = TMDBDate.substring(0,4);
                String KRDBDateYear = KRDBDate.substring(0,4);
                String TMDBName = ""+jsonObj.get("title");
                if(TMDBName.contains(":")){
                    TMDBName = TMDBName.substring(0,TMDBName.indexOf(":"));
                }
                double similarity = calculateStringSimilarity(KRDBName, TMDBName);
                int percentage = (int) (similarity * 100);
                System.out.println(percentage);

                if(jsonObj.get("release_date").equals(KRDBDate)){
                    topTen.add(jsonObj);
                    id=Integer.parseInt(String.valueOf(jsonObj.get("id")) );
                    return id;
                }else if(KRDBDateYear.equals(TMDBDateYear)){
                    if(percentage>70){
                        return Integer.parseInt(String.valueOf(jsonObj.get("id")) );
                    }
                }
            }
        // 검색 결과 매칭이 하나일때 id값 반환
        }else if(jArray.size()==1){
            JSONObject jsonObj = (JSONObject)jArray.get(0);
            id=Integer.parseInt(String.valueOf(jsonObj.get("id")));
        }
        return id;

    }
    // TMDB에서 영화 ID로 하나씩 검색(영화id 리스트 받아서)
    public static JSONArray searchFromTMDBWithMovieId(List<Integer> json) throws ParseException {

        JSONArray fullData = new JSONArray();
        for(int i = 0 ; i < json.size() ; i++){
            int movieCd = json.get(i);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.themoviedb.org/3/movie/"+movieCd+"?append_to_response=videos%2Ccredits&language=ko"))
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


            JSONParser parser = new JSONParser();
            Object obj = parser.parse(response.body());
            JSONObject jsonMain = (JSONObject)obj;

            TMDBMovieDataManager tmdbMovieDataManager = new TMDBMovieDataManager();

            JSONObject tmdbData = tmdbMovieDataManager.TMDBMovieJsonObjectToNeededDataJsonObject(jsonMain);
            System.out.println(tmdbData);
            fullData.add(tmdbData);

        }


        return fullData;
    }

    public JSONArray searchFromTMDBImagesWithMovieId(List<Integer> movieId) throws IOException, InterruptedException, ParseException {
        JSONArray fullData = new JSONArray();
        for(int i = 0 ; i < movieId.size() ; i++){
            int movieCd = movieId.get(i);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.themoviedb.org/3/movie/"+movieCd+"/images"))
                    .header("accept", "application/json")
                    .header("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZmZhYTU1NDc2ZTRjYTdjNzI3Nzg4ZjlmOTMwZDY0NCIsInN1YiI6IjY0OTk0OWQ1NjJmMzM1MDEyNzQ3MzI2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FiFcp5Wrby8LZtoc_h9tQ2v6yOKyKwO2B8pqzavLsW0")
                    .method("GET", HttpRequest.BodyPublishers.noBody())
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

            JSONParser parser = new JSONParser();
            Object obj = parser.parse(response.body());
            JSONObject jsonMain = (JSONObject)obj;
            JSONArray jarray = (JSONArray) jsonMain.get("backdrops");


            if(jarray != null){
                for( int j = 0 ; j < jarray.size() ; j++){
                    JSONObject backdropFiles = new JSONObject();
                    JSONObject backdrops = (JSONObject) jarray.get(j);
                    String link = (String) backdrops.get("file_path");
                    backdropFiles.put("backdropPath",link);
                    backdropFiles.put("movieCd",movieCd);
                    fullData.add(backdropFiles);
                }
            }



        }


        return fullData;
    }


    //============================================= 한국 영화 진흥회 API JSON 분해 ============================================
    public static List<String> unWrapKrdbTitle(String json) throws ParseException {
        JSONParser parser = new JSONParser();
        Object obj = parser.parse(json);
        JSONObject jsonMain = (JSONObject)obj;
        JSONObject jMain = (JSONObject) jsonMain.get("boxOfficeResult");
        JSONArray jArray = (JSONArray)jMain.get("dailyBoxOfficeList");

        List <String> krdbTitle = new ArrayList<>();

        if (jArray.size() > 0){
            for(int i=0; i<jArray.size(); i++){
                JSONObject jsonObj = (JSONObject)jArray.get(i);

                krdbTitle.add((String)jsonObj.get("movieNm"));


            }

        }

        return krdbTitle;

    }
    public static List<String> unWrapKrdbDate(String json) throws ParseException{
        JSONParser parser = new JSONParser();
        Object obj = parser.parse(json);
        JSONObject jsonMain = (JSONObject)obj;
        JSONObject jMain = (JSONObject) jsonMain.get("boxOfficeResult");
        JSONArray jArray = (JSONArray)jMain.get("dailyBoxOfficeList");

        List <String> krdbDate = new ArrayList<>();

        if (jArray.size() > 0){
            for(int i=0; i<jArray.size(); i++){
                JSONObject jsonObj = (JSONObject)jArray.get(i);

                krdbDate.add((String)jsonObj.get("openDt"));

            }

        }

        return krdbDate;
    }
    public static JSONArray unWrapKrdb(String json) throws ParseException{
        JSONParser parser = new JSONParser();
        Object obj = parser.parse(json);
        JSONObject jsonMain = (JSONObject)obj;
        JSONObject jMain = (JSONObject) jsonMain.get("boxOfficeResult");
        JSONArray jArray = (JSONArray)jMain.get("dailyBoxOfficeList");

        JSONArray add = new JSONArray();
        for(int i = 0 ; i < jArray.size() ; i++){
            JSONObject jsonobj = (JSONObject)jArray.get(i);
            JSONObject todayJson = new JSONObject();
            todayJson.put("rank",jsonobj.get("rank"));
            todayJson.put("salesShare",jsonobj.get("salesShare"));
            todayJson.put("audiAcc",jsonobj.get("audiAcc"));
            add.add(todayJson);
        }



        return add;
    }
    public static double calculateStringSimilarity(String str1, String str2) {
        int maxLength = Math.max(str1.length(), str2.length());
        int editDistance = calculateEditDistance(str1, str2);

        return 1.0 - (double) editDistance / maxLength;
    }

    public static int calculateEditDistance(String str1, String str2) {
        int[][] dp = new int[str1.length() + 1][str2.length() + 1];

        for (int i = 0; i <= str1.length(); i++) {
            for (int j = 0; j <= str2.length(); j++) {
                if (i == 0) {
                    dp[i][j] = j;
                } else if (j == 0) {
                    dp[i][j] = i;
                } else if (str1.charAt(i - 1) == str2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i][j - 1], dp[i - 1][j]));
                }
            }
        }

        return dp[str1.length()][str2.length()];
    }

}
