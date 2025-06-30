package com.campusdual.bfp.service;
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

        return user;
    }
    @Transactional
    public boolean existsByUsername(String username) {
        User user = this.userDao.findByLogin(username);
        return user != null;
    }
    public User registerNewUser(String login, String password, String email, long roleId) {
        User user = new User();
        user.setLogin(login);
        user.setPassword(this.passwordEncoder().encode(password));
        user.setEmail(email);

        Role role = roleDao.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + roleId));

        user.setRole(role);

        return userDao.saveAndFlush(user);
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
        User user = this.userDao.findByLogin(login);
        return user != null;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
