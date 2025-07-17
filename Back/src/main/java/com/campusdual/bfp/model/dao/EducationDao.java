package com.campusdual.bfp.model.dao;

import com.campusdual.bfp.model.Education;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EducationDao extends JpaRepository<Education, Long> {
    List<Education> findByCandidateId(long candidateId);
}
