package com.campusdual.bfp.model.dao;

import com.campusdual.bfp.model.Companies;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompaniesDao extends JpaRepository<Companies, Integer> {
}
