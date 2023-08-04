package com.reelreview.controller;
import com.reelreview.service.PeopleDataService;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class PeopleController {
    @Autowired
    private PeopleDataService PDS;

    @RequestMapping()
    public void peopleDataSave(@RequestParam String name) throws IOException, InterruptedException, ParseException {
        Long searchPeopleCd = PDS.getPeopleCdFromData(name);
        PDS.getDataFromPeopleCd(searchPeopleCd);
    }

}
