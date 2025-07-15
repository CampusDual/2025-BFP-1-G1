package com.campusdual.bfp.api;

import com.campusdual.bfp.model.dto.CandidateDTO;
import com.campusdual.bfp.model.dto.JobOffersDTO;

import java.util.List;

public interface IJobOffersService {

    JobOffersDTO queryJobOffer(JobOffersDTO jobOffersDTO);
    List<JobOffersDTO> queryAllJobOffer();
    List<JobOffersDTO> queryAllJobOfferByCompanyId(long id);
    List<JobOffersDTO> queryAllJobOfferByCompanyIdSorted(long id, String sortBy, String direction);
    long insertJobOffer(JobOffersDTO jobOffersDTO);
    List<JobOffersDTO> queryAllOffersFilter(String filterBy);
    List<JobOffersDTO> queryAllOffersSorted(String sortBy, String direction);

    List<JobOffersDTO> queryAllOffersFilterByCompany(String filterBy, Long id);

    JobOffersDTO queryJobOfferById(long id);

    JobOffersDTO updateJobOffer(JobOffersDTO jobOffersDTO);

    JobOffersDTO updateJobOfferActiveStatus(Long id, Boolean isActive);
    List<CandidateDTO> getCandidatesByJobOffer(JobOffersDTO jobOffersDTO);


}