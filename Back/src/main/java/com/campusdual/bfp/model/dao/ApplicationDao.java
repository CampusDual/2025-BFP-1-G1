package com.campusdual.bfp.model.dao;

import com.campusdual.bfp.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicationDao extends JpaRepository<Application, Long> {
    Optional<Application> findByIdCandidateAndIdOffer(Long idCandidate, Long idOffer);
}
