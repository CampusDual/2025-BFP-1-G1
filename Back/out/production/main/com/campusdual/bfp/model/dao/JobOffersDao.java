package com.campusdual.bfp.model.dao;

import com.campusdual.bfp.model.JobOffer;
import com.campusdual.bfp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobOffersDao extends JpaRepository<JobOffer, Long> {

    List<JobOffer> findByUser(User user);

}
