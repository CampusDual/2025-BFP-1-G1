package com.campusdual.bfp.model.dao;

import com.campusdual.bfp.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminDao extends JpaRepository<Admin, Long> {
    Admin findByUserLogin(String login);
}
