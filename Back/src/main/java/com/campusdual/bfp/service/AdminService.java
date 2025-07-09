package com.campusdual.bfp.service;

import com.campusdual.bfp.model.Admin;
import com.campusdual.bfp.model.Candidate;
import com.campusdual.bfp.model.dao.AdminDao;
import com.campusdual.bfp.model.dao.CandidateDao;
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
public class AdminService {
    public static final long ADMIN_ROLE = 1;

    @Autowired
    private AdminDao adminDao;

    @Autowired
    private UserService userService;

    @Transactional(readOnly = true)
    public Admin getAdminLogged() throws AccessDeniedException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserDetails) {
            String username = ((UserDetails) auth.getPrincipal()).getUsername();
            Admin admin = adminDao.findByUserLogin(username);
            if (admin != null) {
                return admin;
            }
        }

        throw new AccessDeniedException("Authenticated principal is not a valid User instance or user not found. Access Denied.");
    }
}
