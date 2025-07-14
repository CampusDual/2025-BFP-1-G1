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
    public UserDataDTO updateCandidate(UserDataDTO userDataDTO) throws AccessDeniedException {

        UserDataDTO userAuth = userDataService.getUserData();

        if (userDataDTO.getCandidate() == null) {
            throw new AccessDeniedException("El usuario no tiene un candidato asociado.");
        }

        if(userAuth.getCandidate().getId() != userDataDTO.getCandidate().getId()) {
            throw new AccessDeniedException("Los id de los candidatos no coinciden. Acceso denegado.");
        }

        Candidate candidate = CandidateMapper.INSTANCE.toEntity(userDataDTO.getCandidate());

        if(userDataDTO.getUser().getEmail() != null) {
            candidate.getUser().setEmail(userDataDTO.getUser().getEmail());
        }

        if(userDataDTO.getCandidate().getName() != null) {
            candidate.setName(userDataDTO.getCandidate().getName());
        }

        if(userDataDTO.getCandidate().getSurname() != null) {
            candidate.setSurname(userDataDTO.getCandidate().getSurname());
        }
        if(userDataDTO.getCandidate().getPhone() != null) {
            candidate.setPhone(userDataDTO.getCandidate().getPhone());
        }
        if(userDataDTO.getCandidate().getBirthDate() != null) {
            candidate.setBirthDate(userDataDTO.getCandidate().getBirthDate());
        }
        if(userDataDTO.getCandidate().getProfileImg() != null) {
            candidate.setProfileImg(userDataDTO.getCandidate().getProfileImg());
        }
        if(userDataDTO.getCandidate().getLocation() != null) {
            candidate.setLocation(userDataDTO.getCandidate().getLocation());
        }
        if(userDataDTO.getCandidate().getQualification() != null) {
            candidate.setQualification(userDataDTO.getCandidate().getQualification());
        }
        if(userDataDTO.getCandidate().getExperience() != null) {
            candidate.setExperience(userDataDTO.getCandidate().getExperience());
        }
        if(userDataDTO.getCandidate().getEmploymentStatus() != null) {
            candidate.setEmploymentStatus(userDataDTO.getCandidate().getEmploymentStatus());
        }
        if(userDataDTO.getCandidate().getAvailability() != null) {
            candidate.setAvailability(userDataDTO.getCandidate().getAvailability());
        }
        if(userDataDTO.getCandidate().getModality() != null) {
            candidate.setModality(userDataDTO.getCandidate().getModality());
        }
        if(userDataDTO.getCandidate().getAboutMe() != null) {
            candidate.setAboutMe(userDataDTO.getCandidate().getAboutMe());
        }
        if(userDataDTO.getCandidate().getLinkedin() != null) {
            candidate.setLinkedin(userDataDTO.getCandidate().getLinkedin());
        }
        if(userDataDTO.getCandidate().getGithub() != null) {
            candidate.setGithub(userDataDTO.getCandidate().getGithub());
        }
        if(userDataDTO.getCandidate().getWeb() != null) {
            candidate.setWeb(userDataDTO.getCandidate().getWeb());
        }

        candidateDao.saveAndFlush(candidate);

        userDataDTO.setCandidate(CandidateMapper.INSTANCE.toDTO(candidate));

        return userDataDTO;

    }

}
