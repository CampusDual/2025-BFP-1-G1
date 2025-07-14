package com.campusdual.bfp.model.dto.dtomapper;

import com.campusdual.bfp.model.Education;
import com.campusdual.bfp.model.dto.EducationDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface EducationMapper {

    EducationMapper INSTANCE = Mappers.getMapper(EducationMapper.class);
    EducationDTO toDTO(Education education);
    List<EducationDTO> toDTOList(List<Education> educations);
    Education toEntity(EducationDTO educationDTO);
}
