package com.campusdual.bfp.service;

import com.campusdual.bfp.model.Company;
import com.campusdual.bfp.model.User;
import com.campusdual.bfp.model.dao.CompanyDao;
import com.campusdual.bfp.model.dto.CompanyDTO;
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
public class CompanyService {

    public static final long COMPANY_ROLE = 2;

    @Autowired
    private CompanyDao companyDao;

    @Autowired
    private UserService userService;

    @Transactional
    public boolean existsByName(String name) {
        Company company = this.companyDao.findByName(name);
        return company != null;
    }

    @Transactional(readOnly = true)
    public Company getCompanyLogged() throws AccessDeniedException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserDetails) {
            String username = ((UserDetails) auth.getPrincipal()).getUsername();
            Company company = companyDao.findByUserLogin(username);
            if (company != null) {
                return company;
            }
        }

        throw new AccessDeniedException("Authenticated principal is not a valid User instance or user not found. Access Denied.");
    }



}
