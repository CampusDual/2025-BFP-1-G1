package com.campusdual.bfp.model.dao;

import com.campusdual.bfp.model.Application;
import com.campusdual.bfp.model.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


public interface ApplicationDao extends JpaRepository<Application, Long> {
    Optional<Application> findByIdCandidateAndIdOffer(long idCandidate, long idOffer);
    List<Application> findByIdCandidate(Long idCandidate);
    List<Application> findByJobOfferId(Long jobOfferId);



}
