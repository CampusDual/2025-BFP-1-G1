package com.campusdual.bfp.model.dao;

import com.campusdual.bfp.model.Candidate;
import com.campusdual.bfp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CandidateDao extends JpaRepository<Candidate, Long> {
    Candidate findByName(String name);
    Candidate findByUserLogin(String login);
    Candidate findByUser(User user);
    Optional<Candidate> findByUserId(Long userId);
    List<Candidate> findByIdIn(List<Long> ids);
    Candidate getReferenceById(Long id);


}
