package com.reelreview;

import com.reelreview.api.service.MovieDataService;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.io.IOException;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@EnableScheduling // 스케줄링을 활성화합니다.
public class ReelReviewApplication {

    @Autowired
    private MovieDataService movieDataService;

    public static void main(String[] args) {
        SpringApplication.run(ReelReviewApplication.class, args);
    }

    @Scheduled(fixedRate = 24*1000*60*60) // 60분(1시간) 간격으로 실행합니다.
    public void runMovieDataService() {
        movieDataService.changeRanktoNull();
        try {
            movieDataService.getBoxOfficeToday();
        } catch (ParseException | IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
        System.out.println("일일 작업이 실행되었습니다!");
    }
}