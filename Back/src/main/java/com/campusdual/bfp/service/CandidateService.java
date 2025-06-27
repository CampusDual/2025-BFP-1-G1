package com.campusdual.bfp.service;

import com.campusdual.bfp.model.Candidate;
import com.campusdual.bfp.model.Role;
import com.campusdual.bfp.model.User;
import com.campusdual.bfp.model.UserRole;
import com.campusdual.bfp.model.dao.CandidateDao;
import com.campusdual.bfp.model.dao.RoleDao;
import com.campusdual.bfp.model.dao.UserDao;
import com.campusdual.bfp.model.dao.UserRoleDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;

@Service
@Lazy
public class CandidateService {
    @Autowired
    private CandidateDao candidateDao;

    @Autowired
    private RoleDao roleDao;

    @Autowired
    private UserRoleDao userRoleDao;

    @Transactional(readOnly = true)
    public Candidate loadCandidateByLogin(String login) throws UsernameNotFoundException {
        Candidate candidate = this.candidateDao.findByLogin(login);
        if (candidate == null) {
            throw new UsernameNotFoundException("User not found: " + login);
        }

        return candidate;
    }
    @Transactional
    public boolean existsByName(String name) {
        Candidate candidate = this.candidateDao.findByName(name);
        return candidate != null;
    }
    @Transactional
    public void registerNewCandidate(String login, String password) {
        Candidate candidate = new Candidate();
        candidate.setLogin(login);
        candidate.setPassword(this.passwordEncoder().encode(password));
        Candidate savedCandidate= this.candidateDao.saveAndFlush(candidate);

        Role role = this.roleDao.findByRoleName("ROLE_USER");
        if (role != null) {
            UserRole userRole = new UserRole();
           // userRole.set(savedCandidate);

            userRole.setRole(role);
            this.userRoleDao.saveAndFlush(userRole);
        }
    }

    public Candidate getUserLogged() throws AccessDeniedException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserDetails) {
            String username = ((UserDetails) auth.getPrincipal()).getUsername();
            Candidate candidate = candidateDao.findByLogin(username);
            if (candidate != null) {
                return candidate;
            }
        }

        throw new AccessDeniedException("Authenticated principal is not a valid User instance or user not found. Access Denied.");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
