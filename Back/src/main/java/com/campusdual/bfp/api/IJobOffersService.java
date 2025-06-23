package com.campusdual.bfp.api;

import com.campusdual.bfp.model.User;
import com.campusdual.bfp.model.dto.JobOffersDTO;

import java.util.List;

public interface IJobOffersService {

    //CRUD Operations

    JobOffersDTO queryJobOffer(JobOffersDTO jobOffersDTO);
    List<JobOffersDTO> queryAllJobOffer();
    List<JobOffersDTO> queryAllJobOfferByUser(User user);
    long insertJobOffer(JobOffersDTO jobOffersDTO);
    long updateJobOffer(JobOffersDTO jobOffersDTO);
    long deleteJobOffer(JobOffersDTO jobOffersDTO);

}
