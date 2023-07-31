package com.reelreview.controller;

import com.reelreview.api.domain.MovieDetailsDTO;
import com.reelreview.api.service.MovieDataService;
import com.reelreview.config.jwt.JwtTokenProvider;
import com.reelreview.domain.CommentDataDto;
import com.reelreview.domain.ProfileDTO;
import com.reelreview.domain.RatingDataDto;
import com.reelreview.domain.WantToSeeDataDto;
import com.reelreview.domain.user.UserEntity;
import com.reelreview.service.DetailService;
import com.reelreview.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserProfileController {

    @Autowired
    private ProfileService profileService;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private DetailService detailService;
    @Autowired
    private MovieDataService movieDataService;

    @PreAuthorize("isAuthenticated()")
    @RequestMapping(value = "/userProfiles", method = RequestMethod.GET)
    public ResponseEntity<Map<String, Object>> userProfilePage (HttpServletRequest request) {
        if (!isTokenValid(request)) {
            return unauthorizedResponse("유효하지 않은 토큰 형식");
        }
        UserEntity userEntity = profileService.getCurrentUserDetails();
        if(userEntity == null) {
            return unauthorizedResponse("사용자 인증 필요");
        }

        ProfileDTO profileDTO = profileService.getProfileByUserCd(userEntity);

        List<RatingDataDto> ratings = detailService.findRatingsByUserCd(userEntity.getUserCd());
        List<MovieDetailsDTO> movieDetailsList = new ArrayList<>();
        for (RatingDataDto ratingData : ratings) {
            int movieId = ratingData.getMovieId();
            MovieDetailsDTO movieDetails = movieDataService.getMovieByMovieId(movieId);
            movieDetailsList.add(movieDetails);
        }

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("userDTO", userEntity);
        responseData.put("profileDTO", profileDTO);
        responseData.put("ratings", ratings);
        responseData.put("movieDetailsList", movieDetailsList);

        return ResponseEntity.ok(responseData);
    }

    // 유저 평가 목록 조회
    @PreAuthorize("isAuthenticated()")
    @RequestMapping(value = "/UserScoreCollection", method = RequestMethod.GET)
    public ResponseEntity<Map<String, Object>> userScoreCollection (HttpServletRequest request) {
        if (!isTokenValid(request)) {
            return unauthorizedResponse("유효하지 않은 토큰 형식");
        }
        UserEntity userEntity = profileService.getCurrentUserDetails();
        if(userEntity == null) {
            return unauthorizedResponse("사용자 인증 필요");
        }

        List<RatingDataDto> ratings = detailService.findRatingsByUserCd(userEntity.getUserCd());
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("userDTO", userEntity);
        responseData.put("ratings", ratings);

        List<MovieDetailsDTO> movieDetailsList = new ArrayList<>();
        for (RatingDataDto ratingData : ratings) {
            int movieId = ratingData.getMovieId();
            MovieDetailsDTO movieDetails = movieDataService.getMovieByMovieId(movieId);
            movieDetailsList.add(movieDetails);
        }
        responseData.put("movieDetailsList", movieDetailsList);

        return ResponseEntity.ok(responseData);
    }

    // 유저 보고싶어요 조회
    @PreAuthorize("isAuthenticated()")
    @RequestMapping(value = "/MovieToWatch", method = RequestMethod.GET)
    public ResponseEntity<Map<String, Object>> userMovieToWatch (HttpServletRequest request) {
        if (!isTokenValid(request)) {
            return unauthorizedResponse("유효하지 않은 토큰 형식");
        }
        UserEntity userEntity = profileService.getCurrentUserDetails();
        if(userEntity == null) {
            return unauthorizedResponse("사용자 인증 필요");
        }

        List<WantToSeeDataDto> wantToSee = detailService.findWantToSeeByUserCd(userEntity.getUserCd());
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("userDTO", userEntity);
        responseData.put("wantToSee", wantToSee);

        List<MovieDetailsDTO> movieDetailsList = new ArrayList<>();
        for (WantToSeeDataDto movieToWatch : wantToSee) {
            int movieId = movieToWatch.getMovieId();
            MovieDetailsDTO movieDetails = movieDataService.getMovieByMovieId(movieId);
            movieDetailsList.add(movieDetails);
        }
        responseData.put("movieDetailsList", movieDetailsList);

        return ResponseEntity.ok(responseData);
    }

    // 유저 커멘트 조회
    @PreAuthorize("isAuthenticated()")
    @RequestMapping(value = "/userComment", method = RequestMethod.GET)
    public ResponseEntity<Map<String, Object>> userComment (HttpServletRequest request) {
        if (!isTokenValid(request)) {
            return unauthorizedResponse("유효하지 않은 토큰 형식");
        }
        UserEntity userEntity = profileService.getCurrentUserDetails();
        if(userEntity == null) {
            return unauthorizedResponse("사용자 인증 필요");
        }

        ProfileDTO profileDTO = profileService.getProfileByUserCd(userEntity);
        List<CommentDataDto> comments = detailService.findCommentsByUserCd(userEntity.getUserCd());
        List<RatingDataDto> ratings = detailService.findRatingsByUserCd(userEntity.getUserCd());

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("userDTO", userEntity);
        responseData.put("comments", comments);
        responseData.put("profileDTO", profileDTO);
        responseData.put("ratings", ratings);

        List<MovieDetailsDTO> movieDetailsList = new ArrayList<>();
        for (CommentDataDto userComments : comments) {
            int movieId = userComments.getMovieId();
            MovieDetailsDTO movieDetails = movieDataService.getMovieByMovieId(movieId);
            movieDetailsList.add(movieDetails);
        }
        responseData.put("movieDetailsList", movieDetailsList);
        return ResponseEntity.ok(responseData);
    }




    //유저 프로필 메시지 변경
    @ResponseBody
    @RequestMapping(value = "/userProfiles/updateUserStatus", method = RequestMethod.PUT)
    public ResponseEntity<?> updateProfileStatus (@RequestBody Map<String, String> requestData) {
        try {
            int userCd = Integer.parseInt(requestData.get("userCd"));
            String newStatus = requestData.get("status");
            profileService.updateProfileStatus(userCd, newStatus);
            return ResponseEntity.ok("Profile status updated");
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid userCd format");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating profile status");
        }
    }

    //유저 프로필 사진 업로드
    @RequestMapping(value ="/userProfiles/updateUserPFP", method = RequestMethod.PUT)
    public ResponseEntity<?> updateProfilePicture(@RequestParam("userCd") int userCd, @RequestParam("profilePicture")MultipartFile profilePicture) {
        return profileService.uploadImage("profile", userCd, profilePicture);
    }

    // 유저 프로필 사진 로드
    @RequestMapping(value ="/userProfiles/getProfilePicture", method = RequestMethod.GET)
    public ResponseEntity<Resource> getProfilePicture(@RequestParam("userCd") int userCd) {
        String filePath = profileService.getProfilePictureByUserCd(userCd);
        return profileService.getImageResourceResponse(filePath);
    }

    // 유저 프로필 배경 사진 업로드
    @RequestMapping(value ="/userProfiles/updateUserPFB", method = RequestMethod.PUT)
    public ResponseEntity<?> updateBackgroundImage(@RequestParam("userCd") int userCd, @RequestParam("backgroundImage")MultipartFile backgroundImage) {
        return profileService.uploadImage("background", userCd, backgroundImage);
    }

    // 유저 배경 사진 로드
    @RequestMapping(value ="/userProfiles/getBackgroundImage", method = RequestMethod.GET)
    public ResponseEntity<Resource> getBackgroundImage(@RequestParam("userCd") int userCd) {
        String filePath = profileService.getBackgroundImageByUserCd(userCd);
        return profileService.getImageResourceResponse(filePath);
    }

    // 프로필사진 or 배경사진 디폴트 값으로 설정
    @ResponseBody
    @RequestMapping(value = "/userProfiles/updateProfileToDefault", method = RequestMethod.PUT)
    public ResponseEntity<?> updateProfileToDefault(@RequestBody Map<String, String> requestData) {
        return profileService.updateUserImageToDefault(requestData);
    }





    // 토큰 유효성, 형식 검사
    private boolean isTokenValid(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            String userEmail = jwtTokenProvider.validate(token);
            return userEmail != null;
        }
        return false;
    }

    private ResponseEntity<Map<String, Object>> unauthorizedResponse(String message) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", message);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }
}