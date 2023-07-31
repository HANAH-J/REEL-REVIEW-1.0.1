package com.reelreview.service;
import com.reelreview.domain.CastDataDTO;
import com.reelreview.repository.CastDataRepository;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;


@Service
public class PeopleDataService {

    @Autowired
    private CastDataRepository castDataRepo;

    //인물 이름검색을 통해 peopleCd 가져오기
    public Long getPeopleCdFromData(@RequestParam String name) throws IOException, InterruptedException, ParseException {
//        List<PeopleDataDTO> peopleDataList = peopleDataRepo.findPeopleDataDTOByPeopleName(name);
//        Long peopleCd = null;
//        for(int i = 0 ; i < peopleDataList.size() ; i ++){
//            PeopleDataDTO pDTO = peopleDataList.get(i);
//            if(pDTO.getPeopleName().equals(name)){
//                peopleCd = pDTO.getPeopleCd();
//                break;
//            }else{
//                peopleCd = null;
//            }
//        }
//        return peopleCd;
        String query = URLEncoder.encode(name,"UTF-8");

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.themoviedb.org/3/search/person?query="+query+"&include_adult=true&language=ko"))
                .header("accept", "application/json")
                .header("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZmZhYTU1NDc2ZTRjYTdjNzI3Nzg4ZjlmOTMwZDY0NCIsInN1YiI6IjY0OTk0OWQ1NjJmMzM1MDEyNzQ3MzI2YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FiFcp5Wrby8LZtoc_h9tQ2v6yOKyKwO2B8pqzavLsW0")
                .method("GET", HttpRequest.BodyPublishers.noBody())
                .build();
        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        JSONParser parser = new JSONParser();
        Object obj = parser.parse(response.body());
        JSONObject jsonMain = (JSONObject)obj;
        JSONObject jobj = (JSONObject) jsonMain.get("results");

        // 여기까지 7.16
        return (Long)jobj.get("id");
    }

    public void getDataFromPeopleCd(Long searchPeopleCd) {

    }
}
