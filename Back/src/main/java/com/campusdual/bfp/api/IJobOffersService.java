package com.campusdual.bfp.api;

import com.campusdual.bfp.model.Company;
import com.campusdual.bfp.model.dto.JobOffersDTO;
import com.campusdual.bfp.model.dto.UserDataDTO;
import org.springframework.data.domain.Sort;

import java.util.List;

public interface IJobOffersService {

    //CRUD Operations

    JobOffersDTO queryJobOffer(JobOffersDTO jobOffersDTO);
    List<JobOffersDTO> queryAllJobOffer();
    List<JobOffersDTO> queryAllJobOfferByCompanyId(long id);
    List<JobOffersDTO> queryAllJobOfferByCompanyIdSorted(long id, String sortBy, String direction);
    long insertJobOffer(JobOffersDTO jobOffersDTO);
    List<JobOffersDTO> queryAllOffersFilter(String filterBy);
    List<JobOffersDTO> queryAllOffersSorted(String sortBy, String direction);

    List<JobOffersDTO> queryAllOffersFilterByCompany(String filterBy, Long id);

    JobOffersDTO queryJobOfferById(long id);
  /*  long updateJobOffer(JobOffersDTO jobOffersDTO);
    long deleteJobOffer(JobOffersDTO jobOffersDTO);*/

}
