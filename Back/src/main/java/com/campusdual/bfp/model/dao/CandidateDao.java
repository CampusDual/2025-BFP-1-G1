package com.campusdual.bfp.model.dao;

import com.campusdual.bfp.model.Candidate;
import com.campusdual.bfp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateDao extends JpaRepository<Candidate, Long> {
    Candidate findByLogin(String login);
    Candidate findByName(String name);
}
