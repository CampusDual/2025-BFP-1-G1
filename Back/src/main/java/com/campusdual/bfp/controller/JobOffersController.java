package com.campusdual.bfp.controller;


import com.campusdual.bfp.api.IJobOffersService;
import com.campusdual.bfp.model.dto.JobOffersDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobOffers")
public class JobOffersController {

    @Autowired
    private IJobOffersService jobOffersService;

    @GetMapping(value= "/testController")
    public String testJobOffersController() {
        return "jobOffers controller works!";
    }

    @PostMapping(value="/get")
    public JobOffersDTO queryJobOffer(@RequestBody JobOffersDTO jobOffersDTO){
        return jobOffersService.queryJobOffer(jobOffersDTO);

    }

    @GetMapping(value = "/getAll")
    public List<JobOffersDTO> queryAllJobOffer(){
        return jobOffersService.queryAllJobOffer();
    }

    @PostMapping(value="/add")
    public long addJobOffer(@RequestBody JobOffersDTO jobOffersDTO){
        return jobOffersService.insertJobOffer(jobOffersDTO);
    }

    @PutMapping (value="/update")
    public long updateJobOffer(@RequestBody JobOffersDTO jobOffersDTO){
        return jobOffersService.updateJobOffer(jobOffersDTO);

    }

    @DeleteMapping (value="/delete")
    public long deleteJobOffer(@RequestBody JobOffersDTO jobOffersDTO){
        return jobOffersService.deleteJobOffer(jobOffersDTO);
    }






}
