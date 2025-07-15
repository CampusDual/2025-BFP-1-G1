package com.campusdual.bfp.model.dto.dtomapper;

import com.campusdual.bfp.model.Company;
import com.campusdual.bfp.model.JobOffer;
import com.campusdual.bfp.model.dto.CompanyDTO;
import com.campusdual.bfp.model.dto.JobOffersDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings; // No estrictamente necesario si solo se usa un @Mapping

import java.util.List;
import org.mapstruct.factory.Mappers; // Importación necesaria

@Mapper(componentModel = "spring")
public interface JobOffersMapper {

    JobOffersMapper INSTANCE = Mappers.getMapper(JobOffersMapper.class);

    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "title", source = "title"),
            @Mapping(target = "description", source = "description"),
            @Mapping(target = "email", source = "email"),
            @Mapping(target = "localizacion", source = "localizacion"),
            @Mapping(target = "modalidad", source = "modalidad"),
            @Mapping(target = "releaseDate", source = "releaseDate"),
            @Mapping(target = "requisitos", source = "requisitos"),
            @Mapping(target = "deseables", source = "deseables"),
            @Mapping(target = "beneficios", source = "beneficios"),
            @Mapping(target = "company", source = "company"),
            @Mapping(target = "active", source = "isActive")
    })
    JobOffersDTO toDTO(JobOffer jobOffer);

    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "title", source = "title"),
            @Mapping(target = "description", source = "description"),
            @Mapping(target = "email", source = "email"),
            @Mapping(target = "localizacion", source = "localizacion"),
            @Mapping(target = "modalidad", source = "modalidad"),
            @Mapping(target = "releaseDate", source = "releaseDate"),
            @Mapping(target = "requisitos", source = "requisitos"),
            @Mapping(target = "deseables", source = "deseables"),
            @Mapping(target = "beneficios", source = "beneficios"),
            @Mapping(target = "company", source = "company"),
            @Mapping(target = "isActive", source = "active")

    })
    JobOffer toEntity(JobOffersDTO jobOfferDTO);

    List<JobOffersDTO> toDTOList(List<JobOffer> jobOffer);

    // Métodos para mapear Company (si no tienes un mapper dedicado para ellas)
    CompanyDTO toCompanyDTO(Company company);
    Company toCompanyEntity(CompanyDTO companyDTO);
}