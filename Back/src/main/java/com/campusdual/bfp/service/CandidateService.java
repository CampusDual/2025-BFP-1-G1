package com.campusdual.bfp.service;

import com.campusdual.bfp.model.Candidate;
import com.campusdual.bfp.model.dao.CandidateDao;
import com.campusdual.bfp.model.dto.CandidateDTO;
import com.campusdual.bfp.model.dto.UserDataDTO;
import com.campusdual.bfp.model.dto.dtomapper.CandidateMapper;
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

    @Autowired
    private UserDataService userDataService;



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

    @Transactional
    public CandidateDTO updateCandidate(CandidateDTO candidateDTO) throws AccessDeniedException {

        UserDataDTO userAuth = userDataService.getUserData();

        if(userAuth.getCandidate().getId() != candidateDTO.getId()) {
            throw new AccessDeniedException("Los id de los candidatos no coinciden. Acceso denegado.");
        }

        Candidate candidate = CandidateMapper.INSTANCE.toEntity(candidateDTO);

        if(candidateDTO.getUser().getEmail() != null) {
            candidate.getUser().setEmail(candidateDTO.getUser().getEmail());
        }

        if(candidateDTO.getName() != null) {
            candidate.setName(candidateDTO.getName());
        }

        if(candidateDTO.getSurname() != null) {
            candidate.setSurname(candidateDTO.getSurname());
        }
        if(candidateDTO.getPhone() != null) {
            candidate.setPhone(candidateDTO.getPhone());
        }
        if(candidateDTO.getBirthDate() != null) {
            candidate.setBirthDate(candidateDTO.getBirthDate());
        }
        if(candidateDTO.getProfileImg() != null) {
            candidate.setProfileImg(candidateDTO.getProfileImg());
        }
        if(candidateDTO.getLocation() != null) {
            candidate.setLocation(candidateDTO.getLocation());
        }
        if(candidateDTO.getQualification() != null) {
            candidate.setQualification(candidateDTO.getQualification());
        }
        if(candidateDTO.getExperience() != null) {
            candidate.setExperience(candidateDTO.getExperience());
        }
        if(candidateDTO.getEmploymentStatus() != null) {
            candidate.setEmploymentStatus(candidateDTO.getEmploymentStatus());
        }
        if(candidateDTO.getAvailability() != null) {
            candidate.setAvailability(candidateDTO.getAvailability());
        }
        if(candidateDTO.getModality() != null) {
            candidate.setModality(candidateDTO.getModality());
        }
        if(candidateDTO.getAboutMe() != null) {
            candidate.setAboutMe(candidateDTO.getAboutMe());
        }
        if(candidateDTO.getLinkedin() != null) {
            candidate.setLinkedin(candidateDTO.getLinkedin());
        }
        if(candidateDTO.getGithub() != null) {
            candidate.setGithub(candidateDTO.getGithub());
        }
        if(candidateDTO.getWeb() != null) {
            candidate.setWeb(candidateDTO.getWeb());
        }

        candidateDao.saveAndFlush(candidate);
        return CandidateMapper.INSTANCE.toDTO(candidate);

    }

}
