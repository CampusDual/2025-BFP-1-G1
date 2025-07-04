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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;

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
    }



