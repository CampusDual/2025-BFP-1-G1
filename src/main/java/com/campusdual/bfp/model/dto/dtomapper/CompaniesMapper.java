package com.campusdual.bfp.model.dto.dtomapper;

import com.campusdual.bfp.model.Companies;
import com.campusdual.bfp.model.dto.CompaniesDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface CompaniesMapper {
    CompaniesMapper INSTANCE = Mappers.getMapper(CompaniesMapper.class);
    CompaniesDTO toDTO(Companies companies);
    List<CompaniesDTO> toDTOList(List<Companies> companies);
    Companies toEntity(CompaniesDTO companiesDTO);
}
