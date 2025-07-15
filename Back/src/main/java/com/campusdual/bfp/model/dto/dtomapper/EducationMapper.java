package com.campusdual.bfp.model.dto.dtomapper;

import com.campusdual.bfp.model.Education;
import com.campusdual.bfp.model.dto.EducationDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface EducationMapper {

    EducationMapper INSTANCE = Mappers.getMapper(EducationMapper.class);
    @Mapping(source = "candidate.id", target = "idCandidate")
    EducationDTO toDTO(Education education);
    List<EducationDTO> toDTOList(List<Education> educations);
    @Mapping(source = "idCandidate", target = "candidate.id")
    Education toEntity(EducationDTO educationDTO);
}
