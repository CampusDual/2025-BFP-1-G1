package com.campusdual.bfp.model.dao;

import com.campusdual.bfp.model.JobOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobOffersDao extends JpaRepository<JobOffer, Long> {

}
