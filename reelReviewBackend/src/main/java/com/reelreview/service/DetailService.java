package com.reelreview.service;

import com.reelreview.api.domain.MovieDetailsDTO;
import com.reelreview.api.domain.MovieGenresDTO;
import com.reelreview.api.domain.MovieImagesDTO;
import com.reelreview.api.domain.MovieVideosDTO;
import com.reelreview.api.repo.ApiMovieDetailRepo;
import com.reelreview.api.repo.ApiMovieGenresRepo;
import com.reelreview.api.repo.ApiMovieImagesRepo;
import com.reelreview.api.repo.ApiMovieVideosRepo;
import com.reelreview.domain.*;
import com.reelreview.domain.user.UserEntity;
import com.reelreview.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DetailService {
    @Autowired
    private ApiMovieImagesRepo MIR;
    @Autowired
    private CrewDataRepository CrewDR;
    @Autowired
    private CastDataRepository CastDR;
    @Autowired
    private ApiMovieVideosRepo MVR;
    @Autowired
    private ApiMovieGenresRepo MGR;
    @Autowired
    private ApiMovieDetailRepo MDR;
    @Autowired
    private RatingDataRepository RDR;
    @Autowired
    private WantToSeeDataRepository WDR;
    @Autowired
    private CommentDataRepository CDR;
    @Autowired
    private UserRepository UR;
    @Autowired
    private ProfileRepository PR;
    @Autowired
    private CcommentDataRepository CCDR;

    public List<MovieImagesDTO> findImagesByMovieCd(Long movieId) {
        List<MovieImagesDTO> m = MIR.findByMovieCd(movieId);
        System.out.println("Service : "+m);
        return m;
    }

    public List<CrewDataDTO> findCrewDataByMovieCd(Long movieCd) {
        List<CrewDataDTO> m = CrewDR.findByMovieCd(movieCd);
        return m;
    }

    public List<CastDataDTO> findCastDataByMoiveCd(Long movieCd) {
        List<CastDataDTO> m = CastDR.findByMovieCd(movieCd);
        return m;
    }

    public List<MovieVideosDTO> findVideosByMovieCd(Long movieCd) {
        List<MovieVideosDTO> m = MVR.findByMovieCd(movieCd);
        return m;
    }

    public List<MovieGenresDTO> findGenresByMovieCd(Long movieCd) {
        List<MovieGenresDTO> m = MGR.findByMovieCd(movieCd);
        return m;
    }

    public List<Integer> findMoviesByGenres(Integer genres) {
        List<Integer> moviecodes = MGR.findMovieCdByGenreId(genres);
        return moviecodes;
    }

    public List<MovieDetailsDTO> findMoviesBymovieCd(List<Integer> simularMovieCd) {
        List<MovieDetailsDTO> movies = MDR.findByMovieIdIn(simularMovieCd);
        return movies;
    }

    public int saveRating(double rate, int userCd, int movieId) {
        RatingDataDto r = new RatingDataDto();
        int dataSaved = 0;
        r.setMovieId(movieId);
        r.setRate(rate);
        r.setUserCd(userCd);
        r.setRatingId(userCd,movieId);
        RatingDataDto a = RDR.save(r);
        if(a!=null){
            dataSaved = 1;
        }
        return dataSaved;
    }

    public int saveWantToSee(int userCd, int movieId) {
        int dataSaved = 0;
        WantToSeeDataDto m = new WantToSeeDataDto();
        m.setMovieId(movieId);
        m.setUserCd(userCd);
        m.setWantToSeeId(userCd,movieId);
        WantToSeeDataDto a  = WDR.save(m);
        System.out.println(a);
        if(a!=null){
            dataSaved = 1;
        }
        return dataSaved;
    }

    public int saveWantToSeeOut(int userCd, int movieId) {
        int dataSaved = 0;
        WantToSeeDataDto d = new WantToSeeDataDto();
        d.setWantToSeeId(userCd,movieId);
        d.setUserCd(userCd);
        d.setMovieId(movieId);
        WDR.delete(d);


        return dataSaved;
    }

    public List<RatingDataDto> findRatingsByUserCd(int userCd) { //(J)
        return RDR.findByUserCd(userCd);
    }

    public List<WantToSeeDataDto> findWantToSeeByUserCd(int userCd) { //(J)
        return WDR.findByUserCd(userCd);
    }

    public List<CommentDataDto> findCommentsByUserCd(int userCd) {
        return CDR.findByUserCd(userCd);
    }

    public RatingDataDto getRatingByMovieIdAndUserCd(int movieId, int userCd) {
        RatingDataDto ratingData = RDR.findByMovieIdAndUserCd(movieId, userCd);
        return ratingData; // RatingDataDto 객체를 반환하도록 수정
    }

    public String saveCommentData(CommentDataDto dto) {
        CommentDataDto saved = new CommentDataDto();
        String result = null;
        saved = CDR.save(dto);

        if(saved!=null){
            result = "저장완료";
        }else {
            result = "저장실패";
        }
        return result;
    }

    public List<CommentDataDto> findCommentsByMovieCd(int movieId) {

        List<CommentDataDto> comments = CDR.findByMovieId(movieId);
        return comments;
    }

    public UserEntity findUserByUserCd(int userCd) {
        UserEntity user = UR.findByUserCd(userCd);
        return user;
    }

    public ProfileDTO findProfileByUser(UserEntity user) {
        ProfileDTO profile = PR.findByUserCd(user);
        return profile;
    }

    public CommentDataDto getCommentById(int commentId) {
        CommentDataDto c = CDR.getById(commentId);
        return c;
    }

    public CommentDataDto findCommentByCommentId(int commentId) {
        CommentDataDto commentInfo = CDR.findCommentByCommentId(commentId);
        return commentInfo;
    }

    public CcommentDataDto saveCcommentData(CcommentDataDto dto) {
        CcommentDataDto c = CCDR.save(dto);
        int commentid = dto.getCommentId();
        CommentDataDto cdto = CDR.getById(commentid);
        cdto.setCCommentcount(cdto.getCCommentcount()+1);
        CDR.save(cdto);
        return c;
    }

    public List<CcommentDataDto> getCcommentByCommentId(int commentId) {
        List<CcommentDataDto> c = CCDR.findByCommentId(commentId);
        return c;
    }

    public CcommentDataDto getCcommentById(int cCommentId) {
        CcommentDataDto c = CCDR.getById(cCommentId);
        return c;
    }

    public String getWantToSee(int userCd, int movieId) {
        WantToSeeDataDto w = new WantToSeeDataDto();
        w.setMovieId(movieId);
        w.setWantToSeeId(userCd,movieId);
        w.setUserCd(userCd);
        WDR.findById(w.getWantToSeeId());

        if(WDR.findById(w.getWantToSeeId()) == null){
            System.out.println("want");
            return "want";
        }else{
            System.out.println("no");

            return "no";
        }
    }

    public List<RatingDataDto> findRatingsByMovieCd(int movieId) {
        List<RatingDataDto> d = RDR.findByMovieId(movieId);


        return d;
    }

    public double getRatingData(int userCd, int movieId) {
        String ratingId = String.valueOf(userCd)+" "+String.valueOf(movieId);
        RatingDataDto r = RDR.getById(ratingId);

        return r.getRate();
    }

    public List<RatingDataDto> getRatingDataBymovieId(int movieId) {
        return RDR.findByMovieId(movieId);
    }

    public List<CommentDataDto> getCommentbyMovieId(int movieId) {
        return CDR.findByMovieId(movieId);
    }
}
