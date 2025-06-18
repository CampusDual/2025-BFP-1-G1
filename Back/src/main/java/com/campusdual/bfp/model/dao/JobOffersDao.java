package com.campusdual.bfp.model.dao;

import com.campusdual.bfp.model.JobOffer;
import com.campusdual.bfp.model.dto.JobOffersDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobOffersDao extends JpaRepository<JobOffer, Long> {
    @Query("SELECT new com.campusdual.bfp.model.dto.JobOffersDTO(j.id, j.email, j.user_id, j.title, u.name, j.description) " +
            "FROM JobOffer j JOIN User u ON j.user_id = u.id WHERE j.user_id = u.id")
    List<JobOffersDTO> findAllJobOffersWithCompanyName();

}
