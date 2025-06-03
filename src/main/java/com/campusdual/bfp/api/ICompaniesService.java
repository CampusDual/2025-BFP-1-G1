package com.campusdual.bfp.api;

import com.campusdual.bfp.model.dto.CompaniesDTO;

import java.util.List;

public interface ICompaniesService {

    // CRUD Operations

    CompaniesDTO queryCompanies(CompaniesDTO companiesDTO);
    List<CompaniesDTO> queryAllCompanies();
    int insertCompanies(CompaniesDTO companiesDTO);
    int updateCompanies(CompaniesDTO companiesDTO);
    int deleteCompanies(CompaniesDTO companiesDTO);


}
