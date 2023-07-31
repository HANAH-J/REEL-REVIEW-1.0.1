package com.reelreview.controller;

import com.reelreview.api.domain.MovieDetailsDTO;
import com.reelreview.api.domain.MovieGenresDTO;
import com.reelreview.api.domain.MovieImagesDTO;

import com.reelreview.api.domain.MovieVideosDTO;
import com.reelreview.api.repo.ApiMovieImagesRepo;
import com.reelreview.api.service.MovieDataService;
import com.reelreview.config.jwt.JwtTokenProvider;
import com.reelreview.domain.*;
import com.reelreview.domain.user.UserEntity;
import com.reelreview.service.DetailService;
import com.reelreview.service.ProfileService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.swing.text.html.parser.Parser;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class DetailController {

    @Autowired
    private DetailService DS;
    @Autowired
    private ProfileService profileService;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private MovieDataService movieDataService;

    @RequestMapping("api/getMovieImages")
    public List<MovieImagesDTO> getMovieImages(@RequestParam("movieId") int movieId){
        Long movieCd = Long.valueOf(movieId);
        List<MovieImagesDTO> movieImages = DS.findImagesByMovieCd(movieCd);
        return movieImages;
    }
    @RequestMapping("api/getMovieFulldata")
    public JSONObject getMovieFulldata(@RequestParam("movieId") int movieId) {
        JSONObject fulldata = new JSONObject();
        Long movieCd = Long.valueOf(movieId);
        List<MovieImagesDTO> movieImages = DS.findImagesByMovieCd(movieCd);
        List<CrewDataDTO> movieCrews = DS.findCrewDataByMovieCd(movieCd);
        List<CastDataDTO> movieCasts = DS.findCastDataByMoiveCd(movieCd);
        List<MovieVideosDTO> movieVideos = DS.findVideosByMovieCd(movieCd);
        List<MovieGenresDTO> movieGenres = DS.findGenresByMovieCd(movieCd);

        if (movieGenres != null && !movieGenres.isEmpty()) {
            Integer genre = movieGenres.get(0).getGenreId();
            List<Integer> simularMovieCd = DS.findMoviesByGenres(genre);
            List<MovieDetailsDTO> simularMovieDetails = DS.findMoviesBymovieCd(simularMovieCd);
            fulldata.put("simularMovieDetails", simularMovieDetails);
        }

        List<CommentDataDto> comments = DS.findCommentsByMovieCd(movieId);
        List<RatingDataDto> ratings = DS.findRatingsByMovieCd(movieId);

        fulldata.put("movieImages", movieImages);
        fulldata.put("movieCrews", movieCrews);
        fulldata.put("movieCasts", movieCasts);
        fulldata.put("movieVideos", movieVideos);
        fulldata.put("comments", comments);
        fulldata.put("ratings", ratings);

        System.out.println("==================================================================================================================================" + ratings);

        return fulldata;
    }

    @PreAuthorize("isAuthenticated()")
    @RequestMapping("details/setRating")
    public List<RatingDataDto> setUserRating(HttpServletRequest request, @RequestHeader("Authorization") String authorizationHeader){
        String token = authorizationHeader;
        double rate = Double.parseDouble(request.getParameter("rate"));
        int movieId = Integer.parseInt(request.getParameter("movieId"));
        System.out.println(token);

        if (token != null && token.startsWith("Bearer ")) { // 토큰 형식 검사
            token = token.substring(7);
        } else {
            String errorResponse = "유효하지 않은 토큰 형식1";

        }

        // 토큰 유효성 검사 ... 만료된 토큰이거나, 서명 키가 일치하지 않는 토큰
        String userEmail = jwtTokenProvider.validate(token);
        if (userEmail == null) {
            String errorResponse = "유효하지 않은 토큰 형식2";

        }

        UserEntity userEntity = profileService.getCurrentUserDetails();

        if(userEntity == null) {
            String errorResponse = "유효하지 않은 토큰 형식3";

        }
        int userCd = userEntity.getUserCd();
        int saved = 0;
        saved = DS.saveRating(rate,userCd,movieId);
        List<RatingDataDto> r = DS.getRatingDataBymovieId(movieId);


        return r;
    }


    @PreAuthorize("isAuthenticated()")
    @RequestMapping("details/wantToSee")
    public String setUserWantToSee(HttpServletRequest request, @RequestHeader("Authorization") String authorizationHeader){
        String token = authorizationHeader;
        int movieId = Integer.parseInt(request.getParameter("movieId"));
        if (token != null && token.startsWith("Bearer ")) { // 토큰 형식 검사
            token = token.substring(7);
        } else {
            String errorResponse = "유효하지 않은 토큰 형식1";
            return errorResponse;
        }
        // 토큰 유효성 검사 ... 만료된 토큰이거나, 서명 키가 일치하지 않는 토큰
        String userEmail = jwtTokenProvider.validate(token);
        if (userEmail == null) {
            String errorResponse = "유효하지 않은 토큰 형식2";
            return errorResponse;
        }
        UserEntity userEntity = profileService.getCurrentUserDetails();
        if(userEntity == null) {
            String errorResponse = "유효하지 않은 토큰 형식3";
            return errorResponse;
        }
        int userCd = userEntity.getUserCd();
        int saved = 0;
        saved = DS.saveWantToSee(userCd,movieId);
        if(saved == 1){
            return "저장완료";
        }else{
            String errorResponse = "저장 실패";
            return errorResponse;
        }
    }

    @PreAuthorize("isAuthenticated()")
    @RequestMapping("details/wantToSeeOut")
    public String setUserWantToSeeOut(HttpServletRequest request, @RequestHeader("Authorization") String authorizationHeader){
        String token = authorizationHeader;
        int movieId = Integer.parseInt(request.getParameter("movieId"));

        if (token != null && token.startsWith("Bearer ")) { // 토큰 형식 검사
            token = token.substring(7);
        } else {
            String errorResponse = "유효하지 않은 토큰 형식1";
            return errorResponse;
        }

        // 토큰 유효성 검사 ... 만료된 토큰이거나, 서명 키가 일치하지 않는 토큰
        String userEmail = jwtTokenProvider.validate(token);
        if (userEmail == null) {
            String errorResponse = "유효하지 않은 토큰 형식2";
            return errorResponse;
        }

        UserEntity userEntity = profileService.getCurrentUserDetails();

        if(userEntity == null) {
            String errorResponse = "유효하지 않은 토큰 형식3";
            return errorResponse;
        }
        int userCd = userEntity.getUserCd();
        int saved = 0;
        saved = DS.saveWantToSeeOut(userCd,movieId);

        if(saved == 1){
            return "저장완료";
        }else{
            String errorResponse = "저장 실패";
            return errorResponse;
        }
    }

    @PreAuthorize("isAuthenticated()")
    @RequestMapping("details/commentSave")
    public List<CommentDataDto> commentSave(HttpServletRequest request, @RequestHeader("Authorization") String authorizationHeader){
        String token = authorizationHeader;
        int movieId = Integer.parseInt(request.getParameter("movieId"));

        if (token != null && token.startsWith("Bearer ")) { // 토큰 형식 검사
            token = token.substring(7);
        } else {
            String errorResponse = "유효하지 않은 토큰 형식1";

        }

        // 토큰 유효성 검사 ... 만료된 토큰이거나, 서명 키가 일치하지 않는 토큰
        String userEmail = jwtTokenProvider.validate(token);
        if (userEmail == null) {
            String errorResponse = "유효하지 않은 토큰 형식2";

        }

        UserEntity userEntity = profileService.getCurrentUserDetails();

        if(userEntity == null) {
            String errorResponse = "유효하지 않은 토큰 형식3";

        }
        int userCd = userEntity.getUserCd();

        CommentDataDto dto = new CommentDataDto();

        LocalDate l = LocalDate.now();
        String now = l.toString();
        dto.setUserName(userEntity.getUsername());
        dto.setCommentDate(now);
        dto.setCommentContent(request.getParameter("commentContent"));
        dto.setUserCd(userCd);
        dto.setMovieId(movieId);
        dto.setCCommentcount(0);
        dto.setCommentGood(0);

        DS.saveCommentData(dto);
        List<CommentDataDto> a = DS.getCommentbyMovieId(movieId);


        return a;
    }
    @RequestMapping("details/getComments")
    public List<CommentDataDto> getCommentMovie(@RequestParam("movieId") int movieId){
        return DS.getCommentbyMovieId(movieId);
    }
    @RequestMapping("details/commentGetUser")
    public CommentUserDTO getCommentUser(@RequestParam("userCd") int userCd){

        UserEntity user = DS.findUserByUserCd(userCd);
        System.out.println(user);
        if(user==null){
            return null;
        }
        ProfileDTO profile = DS.findProfileByUser(user);
        System.out.println(profile);
        CommentUserDTO cud = new CommentUserDTO();
        cud.setUserName(user.getUsername());
        cud.setPFImage(profile.getPfImage());

        return cud;
    }

    @RequestMapping("comment/commentGoodUp")
    public void commentGoodUp(@RequestBody Map<String, Integer> requestBody){
        int commentId = requestBody.get("commentId");
        CommentDataDto comment = DS.getCommentById(commentId);
        comment.setCommentGood(comment.getCommentGood()+1);
        DS.saveCommentData(comment);
    }
    @RequestMapping("comment/cCommentGoodUp")
    public CcommentDataDto cCommentGoodUp(@RequestBody Map<String, Integer> requestBody){
        int cCommentId = requestBody.get("cCommentId");
        CcommentDataDto cComment = DS.getCcommentById(cCommentId);
        cComment.setCCommentGood(cComment.getCCommentGood()+1);
        DS.saveCcommentData(cComment);

        return DS.saveCcommentData(cComment);
    }


    @PreAuthorize("isAuthenticated()")
    @RequestMapping("details/cCommentSave")
    public String cCommentSave(HttpServletRequest request, @RequestHeader("Authorization") String authorizationHeader){
        String token = authorizationHeader;
        int commentId = Integer.parseInt(request.getParameter("commentId"));

        if (token != null && token.startsWith("Bearer ")) { // 토큰 형식 검사
            token = token.substring(7);
        } else {
            String errorResponse = "유효하지 않은 토큰 형식1";
            return errorResponse;
        }

        // 토큰 유효성 검사 ... 만료된 토큰이거나, 서명 키가 일치하지 않는 토큰
        String userEmail = jwtTokenProvider.validate(token);
        if (userEmail == null) {
            String errorResponse = "유효하지 않은 토큰 형식2";
            return errorResponse;
        }

        UserEntity userEntity = profileService.getCurrentUserDetails();

        if(userEntity == null) {
            String errorResponse = "유효하지 않은 토큰 형식3";
            return errorResponse;
        }
        int userCd = userEntity.getUserCd();

        CcommentDataDto dto = new CcommentDataDto();
        LocalDate l = LocalDate.now();  //(J)
        String now = l.toString();  //(J)

        dto.setCCommentContent(request.getParameter("cCommentContent"));
        dto.setUserCd(userCd);
        dto.setCommentId(commentId);
        dto.setUserName(userEntity.getUsername());
        dto.setCCommentDate(now);  //(J)

        CcommentDataDto a = DS.saveCcommentData(dto);
        String result = a.getUserName();
        return result;
    }
    @RequestMapping("details/getCcomment")
    public List<CcommentDataDto> getCcomment(@RequestParam("commentId") int commentId){
        List<CcommentDataDto> c = DS.getCcommentByCommentId(commentId);
        System.out.println(c);
        return c;
    }


    @RequestMapping("details/getWantToSee")
    public JSONObject getWantToSee(HttpServletRequest request, @RequestHeader("Authorization") String authorizationHeader){
        int movieId = Integer.parseInt(request.getParameter("movieId"));
        String token = authorizationHeader;

        if (token != null && token.startsWith("Bearer ")) { // 토큰 형식 검사
            token = token.substring(7);
        } else {
            String errorResponse = "유효하지 않은 토큰 형식1";
            System.out.println(errorResponse);
        }

        // 토큰 유효성 검사 ... 만료된 토큰이거나, 서명 키가 일치하지 않는 토큰
        String userEmail = jwtTokenProvider.validate(token);
        if (userEmail == null) {
            String errorResponse = "유효하지 않은 토큰 형식2";
            System.out.println(errorResponse);
        }

        UserEntity userEntity = profileService.getCurrentUserDetails();

        if(userEntity == null) {
            String errorResponse = "유효하지 않은 토큰 형식3";
            System.out.println(errorResponse);
        }
        int userCd = userEntity.getUserCd();
        String want = DS.getWantToSee(userCd,movieId);
        int num = 0;
        if(want.equals("want")){
            num = 5;
        }
        double rate = DS.getRatingData(userCd,movieId);
        rate = rate+num;
        JSONObject j = new JSONObject();
        j.put("want",want);
        j.put("rate",rate);
        return j;
    }

    @RequestMapping(value = "/getMovieDetailsForThisComment", method = RequestMethod.GET)
    public ResponseEntity<Map<String, Object>> getMovieDetail (@RequestParam("movieId") int movieId) {
        Map<String, Object> responseData = new HashMap<>();
        List<MovieDetailsDTO> movieDetailsList = new ArrayList<>();
        MovieDetailsDTO movieDetails = movieDataService.getMovieByMovieId(movieId);
        movieDetailsList.add(movieDetails);
        responseData.put("movieDetailsList", movieDetailsList);

        return ResponseEntity.ok(responseData);
    }

    @RequestMapping(value = "/getRatingDataForThisComment", method = RequestMethod.GET)
    public ResponseEntity<RatingDataDto> getRatingData(@RequestParam("movieId") int movieId, @RequestParam("userCd") int userCd) {
        RatingDataDto ratingData = DS.getRatingByMovieIdAndUserCd(movieId, userCd);
        return ResponseEntity.ok(ratingData);
    }

    @RequestMapping(value = "/getInfoForThisComment", method = RequestMethod.GET)
    public ResponseEntity<Map<String, Object>> getInfoForThisComment(@RequestParam("commentId") int commentId) {
        Map<String, Object> responseData = new HashMap<>();
        CommentDataDto commentInfo = DS.findCommentByCommentId(commentId);
        responseData.put("commentInfo", commentInfo);
        return ResponseEntity.ok(responseData);
    }


}
