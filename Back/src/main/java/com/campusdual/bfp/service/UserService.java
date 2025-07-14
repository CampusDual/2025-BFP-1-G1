package com.campusdual.bfp.service;

import com.campusdual.bfp.exception.RegistrationException;
import com.campusdual.bfp.model.Candidate;
import com.campusdual.bfp.model.Role;
import com.campusdual.bfp.model.User;
import com.campusdual.bfp.model.UserRole;
import com.campusdual.bfp.model.dao.CandidateDao;
import com.campusdual.bfp.model.dao.RoleDao;
import com.campusdual.bfp.model.dao.UserDao;
import com.campusdual.bfp.model.dao.UserRoleDao;
import com.campusdual.bfp.model.dto.CandidateDTO;
import com.campusdual.bfp.model.dto.CompanyDTO;
import com.campusdual.bfp.model.dto.UserDTO;
import com.campusdual.bfp.model.dto.UserDataDTO;
import com.campusdual.bfp.model.dto.dtomapper.CandidateMapper;
import com.campusdual.bfp.model.dto.dtomapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;

@Service
@Lazy
public class UserService implements UserDetailsService {
    @Autowired
    private UserDao userDao;
    @Autowired
    private RoleDao roleDao;
    @Autowired
    private UserRoleDao userRoleDao;
    @Autowired
    private CandidateDao candidateDao;

    @Override
    @Transactional(readOnly = true)
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = this.userDao.findByLogin(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }
        return user;
    }

    @Transactional
    public boolean existsByUsername(String username) {
        User user = this.userDao.findByLogin(username);
        return user != null;
    }

    @Transactional
    public UserDataDTO registerNewCandidate(UserDTO userDTO, CandidateDTO candidateDTO) {
        if (userDao.findByLogin(userDTO.getLogin()) != null) {
            throw new RegistrationException("login", "DUPLICATE_USERNAME", "Este nombre de usuario ya existe");
        }
        // Check if email already exists
        if (userDao.findByEmail(userDTO.getEmail()) != null) {
            throw new RegistrationException("email", "DUPLICATE_EMAIL", "Este email ya existe");
        }

        User user = UserMapper.INSTANCE.toEntity(userDTO);
        user.setPassword(this.passwordEncoder().encode(user.getPassword()));
        Role role = roleDao.findById(3L).orElseThrow(() -> new RuntimeException("Role not found with id: " + user.getRole().getId()));
        user.setRole(role);
        Candidate candidate = CandidateMapper.INSTANCE.toEntity(candidateDTO);
        candidate.setUser(user);
        userDao.saveAndFlush(user);
        candidateDao.saveAndFlush(candidate);
        UserDataDTO userDataDTO = new UserDataDTO();
        userDataDTO.setUser(UserMapper.INSTANCE.toDTO(user));
        userDataDTO.setCandidate(CandidateMapper.INSTANCE.toDTO(candidate));
        return userDataDTO;
    }

    public User getUserLogged() throws AccessDeniedException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserDetails) {
            String username = ((UserDetails) auth.getPrincipal()).getUsername();
            User user = userDao.findByLogin(username);
            if (user != null) {
                return user;
            }
        }
        throw new AccessDeniedException("Authenticated principal is not a valid User instance or user not found. Access Denied.");
    }

    @Transactional
    public boolean existsByLogin(String login) {
        return userDao.findByLogin(login) != null;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}