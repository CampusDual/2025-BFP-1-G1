package com.campusdual.bfp.service;

import com.campusdual.bfp.model.Candidate;
import com.campusdual.bfp.model.User;
import com.campusdual.bfp.model.dao.CandidateDao;
import com.campusdual.bfp.model.dto.CandidateDTO;
import com.campusdual.bfp.model.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;

@Service
@Lazy
public class CandidateService {

    public static final long CANDIDATE_ROLE = 3;

    @Autowired
    private CandidateDao candidateDao;

    @Autowired
    private UserService userService;


    @Transactional
    public boolean existsByName(String name) {
        Candidate candidate = this.candidateDao.findByName(name);
        return candidate != null;
    }

    @Transactional(readOnly = true)
    public Candidate getCandidateLogged() throws AccessDeniedException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserDetails) {
            String username = ((UserDetails) auth.getPrincipal()).getUsername();
            Candidate candidate = candidateDao.findByUserLogin(username);
            if (candidate != null) {
                return candidate;
            }
        }

        throw new AccessDeniedException("Authenticated principal is not a valid User instance or user not found. Access Denied.");
    }



}
