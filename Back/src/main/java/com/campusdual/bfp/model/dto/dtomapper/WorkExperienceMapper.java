package com.campusdual.bfp.model.dto.dtomapper;

import com.campusdual.bfp.model.WorkExperience;
import com.campusdual.bfp.model.dto.WorkExperienceDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface WorkExperienceMapper {

    WorkExperienceMapper INSTANCE = Mappers.getMapper(WorkExperienceMapper.class);
    @Mapping(source = "candidate.id", target = "idCandidate")
    WorkExperienceDTO toDTO(WorkExperience workExperience);
    List<WorkExperienceDTO> toDTOList(List<WorkExperience> workExperiences);
    @Mapping(source = "idCandidate", target = "candidate.id")
    WorkExperience toEntity(WorkExperienceDTO workExperienceDTO);
}
