package com.campusdual.bfp.service;

import com.campusdual.bfp.model.Candidate;
import com.campusdual.bfp.model.Company;
import com.campusdual.bfp.model.User;
import com.campusdual.bfp.model.dao.CandidateDao;
import com.campusdual.bfp.model.dao.CompanyDao;
import com.campusdual.bfp.model.dao.UserDao;
import com.campusdual.bfp.model.dto.UserDataDTO;
import com.campusdual.bfp.model.dto.dtomapper.CandidateMapper;
import com.campusdual.bfp.model.dto.dtomapper.CompanyMapper;
import com.campusdual.bfp.model.dto.dtomapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Lazy
public class UserDataService {
    @Autowired
    private CompanyDao companyDao;

    @Autowired
    private CandidateDao candidateDao;

    @Autowired
    private UserDao userDao;



    @Transactional
    public  UserDataDTO getUserData() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDataDTO userData = new UserDataDTO();
        User user = userDao.findByLogin(auth.getName());
        if (user != null) {
            userData.setUser(UserMapper.INSTANCE.toDTO(user));
        }
        Company company = companyDao.findByUser(user);
        if (company != null) {
            userData.setCompany(CompanyMapper.INSTANCE.toDTO(company));
        }
        Candidate candidate = candidateDao.findByUser(user);
        if (candidate != null) {
            userData.setCandidate(CandidateMapper.INSTANCE.toDTO(candidate));
        }
        return userData;
    }



    @Transactional(readOnly = true)
    public UserDataDTO getUserDataById(Long userId) {

        Optional<User> userOpt = userDao.findById(userId);
       User useren = userDao.getReferenceById(userId);
        if (userOpt.isEmpty()) {
            return null;
        }

        User user = userOpt.get();
        UserDataDTO userDataDTO = new UserDataDTO();
        userDataDTO.setUser(UserMapper.INSTANCE.toDTO(user));

        Company company = companyDao.findByUser(user);
        if (company != null) {
            userDataDTO.setCompany(CompanyMapper.INSTANCE.toDTO(company));
        }

        Candidate candidate = candidateDao.findByUser(user);
        if (candidate != null) {
            userDataDTO.setCandidate(CandidateMapper.INSTANCE.toDTO(candidate));
        }

        return userDataDTO;
    }
    }



