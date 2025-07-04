package com.campusdual.bfp.api;

import com.campusdual.bfp.model.Company;
import com.campusdual.bfp.model.dto.JobOffersDTO;
import com.campusdual.bfp.model.dto.UserDataDTO;

import java.util.List;

public interface IJobOffersService {

    //CRUD Operations

    JobOffersDTO queryJobOffer(JobOffersDTO jobOffersDTO);
    List<JobOffersDTO> queryAllJobOffer();
    List<JobOffersDTO> queryAllJobOfferByCompanyId(long id);
    long insertJobOffer(JobOffersDTO jobOffersDTO);
  /*  long updateJobOffer(JobOffersDTO jobOffersDTO);
    long deleteJobOffer(JobOffersDTO jobOffersDTO);*/

}
