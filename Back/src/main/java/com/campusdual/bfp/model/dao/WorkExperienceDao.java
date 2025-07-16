package com.campusdual.bfp.model.dao;

import com.campusdual.bfp.model.WorkExperience;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkExperienceDao extends JpaRepository<WorkExperience, Long> {
    List<WorkExperience> findByCandidateId(long candidateId);
}
