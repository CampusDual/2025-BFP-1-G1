package com.campusdual.bfp.controller;

import com.campusdual.bfp.api.IJobOffersService;
import com.campusdual.bfp.model.Company;
import com.campusdual.bfp.model.dto.JobOffersDTO;
import com.campusdual.bfp.model.dto.UserDataDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/profileOffers")
public class ProfileOffersController {

    @Autowired
    private IJobOffersService jobOffersService;


    @GetMapping(value= "/testController")
    public String testJobOffersController() {
        return "profileOffers controller works!";
    }

    @PostMapping(value="/get")
    public JobOffersDTO queryJobOffer(@RequestBody JobOffersDTO jobOffersDTO){
        return jobOffersService.queryJobOffer(jobOffersDTO);
    }

    @GetMapping(value = "/getAll")
    public List<JobOffersDTO> getOffersForCurrentCompany() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        if(principal instanceof UserDataDTO) {
            UserDataDTO currentCompany = (UserDataDTO) principal;
            return jobOffersService.queryAllJobOfferByCompany(currentCompany);
        } else {
            throw new AccessDeniedException("Authenticated principal is not a valid User instance");
        }
    }

  /*  @PutMapping (value="/update")
    public long updateJobOffer(@RequestBody JobOffersDTO jobOffersDTO){
        return jobOffersService.updateJobOffer(jobOffersDTO);

    }

    @DeleteMapping (value="/delete")
    public long deleteJobOffer(@RequestBody JobOffersDTO jobOffersDTO){
        return jobOffersService.deleteJobOffer(jobOffersDTO);
    }*/

}
