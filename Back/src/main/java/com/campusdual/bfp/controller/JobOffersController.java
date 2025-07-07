package com.campusdual.bfp.controller;

import com.campusdual.bfp.api.IJobOffersService;

import com.campusdual.bfp.model.dto.JobOffersDTO;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/jobOffers")
public class JobOffersController {

    @Autowired
    private IJobOffersService jobOffersService;

    @GetMapping(value = "/testController")
    public String testJobOffersController() {
        return "jobOffers controller works!";
    }

    @PostMapping(value = "/get")
    public ResponseEntity<?> queryJobOffer(@RequestBody JobOffersDTO jobOffersDTO) {
        return ResponseEntity.ok(jobOffersService.queryJobOffer(jobOffersDTO));
    }

    @GetMapping(value = "/getAll")
    public ResponseEntity<List<JobOffersDTO>> queryAllJobOffer() {
        return ResponseEntity.ok(jobOffersService.queryAllJobOffer());

    }

    @GetMapping(value = "/sort")
    public ResponseEntity<List<JobOffersDTO>> queryAllOffersSorted(@RequestParam String sortBy, @RequestParam String direction) {
        return ResponseEntity.ok(jobOffersService.queryAllOffersSorted(sortBy, direction));
    }


    @GetMapping(value = "/filter")
    public ResponseEntity<List<JobOffersDTO>> queryAllOffersFilter(@RequestParam String filterBy) {
        return ResponseEntity.ok(jobOffersService.queryAllOffersFilter(filterBy));
    }

}