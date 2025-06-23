package com.campusdual.bfp.service;
import java.util.Optional;
import com.campusdual.bfp.model.Role;
import com.campusdual.bfp.model.User;
import com.campusdual.bfp.model.UserRole;
import com.campusdual.bfp.model.dao.RoleDao;
import com.campusdual.bfp.model.dao.UserDao;
import com.campusdual.bfp.model.dao.UserRoleDao;
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
import java.util.Collections;

@Service
@Lazy
public class UserService implements UserDetailsService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private RoleDao roleDao;

    @Autowired
    private UserRoleDao userRoleDao;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = this.userDao.findByLogin(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }

        return user;//new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), Collections.emptyList());
    }
    @Transactional
    public boolean existsByUsername(String username) {
        User user = this.userDao.findByLogin(username);
        return user != null;
    }
    @Transactional
    public void registerNewUser(String username, String password) {
        User user = new User();
        user.setLogin(username);
        user.setName(username);
        user.setPassword(this.passwordEncoder().encode(password));
        User savedUser = this.userDao.saveAndFlush(user);

        Role role = this.roleDao.findByRoleName("ROLE_USER");
        if (role != null) {
            UserRole userRole = new UserRole();
            userRole.setUser(savedUser);
            userRole.setRole(role);
            this.userRoleDao.saveAndFlush(userRole);
        }
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

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
