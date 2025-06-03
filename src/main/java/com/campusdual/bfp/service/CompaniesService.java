package com.campusdual.bfp.service;


import com.campusdual.bfp.api.ICompaniesService;
import com.campusdual.bfp.model.Companies;
import com.campusdual.bfp.model.dao.CompaniesDao;
import com.campusdual.bfp.model.dto.CompaniesDTO;
import com.campusdual.bfp.model.dto.dtomapper.CompaniesMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("CompaniesService")
@Lazy
public class CompaniesService implements ICompaniesService {

    @Autowired
    private CompaniesDao companiesDao;

    @Override
    public CompaniesDTO queryCompanies(CompaniesDTO companiesDTO) {
        Companies companies = CompaniesMapper.INSTANCE.toEntity(companiesDTO);
        return CompaniesMapper.INSTANCE.toDTO(companiesDao.getReferenceById(companies.getId()));
    }

    @Override
    public List<CompaniesDTO> queryAllCompanies() {
        return CompaniesMapper.INSTANCE.toDTOList(companiesDao.findAll());
    }

    @Override
    public int insertCompanies(CompaniesDTO companiesDTO) {
        Companies companies = CompaniesMapper.INSTANCE.toEntity(companiesDTO);
        companiesDao.saveAndFlush(companies);
        return companies.getId();
    }

    @Override
    public int updateCompanies(CompaniesDTO companiesDTO) {
        return insertCompanies(companiesDTO);
    }

    @Override
    public int deleteCompanies(CompaniesDTO companiesDTO) {
        int id = companiesDTO.getId();
        Companies companies = CompaniesMapper.INSTANCE.toEntity(companiesDTO);
        companiesDao.delete(companies);
        return id;
    }
}
