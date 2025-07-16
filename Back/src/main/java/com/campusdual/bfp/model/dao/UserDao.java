package com.campusdual.bfp.model.dao;

import com.campusdual.bfp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


public interface UserDao extends JpaRepository<User, Long> {
    User findByLogin(String login);
    User findByEmail(String email);


}
