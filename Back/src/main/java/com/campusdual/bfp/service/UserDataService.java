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

import java.util.Map;
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
    public UserDataDTO getUserData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return new UserDataDTO();
        }

        String username = authentication.getName();
        User user = userDao.findByLogin(username);
        if (user == null) {
            return new UserDataDTO();
        }

        UserDataDTO userDataDTO = new UserDataDTO();
        userDataDTO.setUser(UserMapper.INSTANCE.toDTO(user));

        // Get role ID from authentication details if available
        Long roleId = null;
        if (authentication.getDetails() instanceof Map) {
            Map<?, ?> details = (Map<?, ?>) authentication.getDetails();
            if (details != null && details.containsKey("roleId")) {
                roleId = ((Number) details.get("roleId")).longValue();
            }
        }

        // If role ID not in details, get it from the user object
        if (roleId == null && user.getRole() != null) {
            roleId = user.getRole().getId();
        }

        // Set role ID in user DTO
        if (roleId != null) {
            userDataDTO.getUser().setRole_id(roleId);
        }

        if (roleId != null) {
            switch (roleId.intValue()) {
                case 3: // Candidate
                    Candidate candidate = candidateDao.findByUser(user);
                    if (candidate != null) {
                        userDataDTO.setCandidate(CandidateMapper.INSTANCE.toDTO(candidate));
                    }
                    break;
                case 2: // Company
                    Company company = companyDao.findByUser(user);
                    if (company != null) {
                        userDataDTO.setCompany(CompanyMapper.INSTANCE.toDTO(company));
                    }
                    break;
                case 1: // Admin
                    // If you have an Admin entity and DAO, uncomment and implement this
                    // Admin admin = adminDao.findByUser(user);
                    // if (admin != null) {
                    //     userDataDTO.setAdmin(AdminMapper.INSTANCE.toDTO(admin));
                    // }
                    break;
            }
        }

        return userDataDTO;
    }

    @Transactional(readOnly = true)
    public UserDataDTO getUserDataById(Long userId) {
        User user= userDao.getReferenceById(userId);


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
