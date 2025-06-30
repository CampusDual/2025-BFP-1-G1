package com.campusdual.bfp.model.dto.dtomapper;

import com.campusdual.bfp.model.Candidate;
import com.campusdual.bfp.model.dto.CandidateDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(uses = {UserMapper.class})
public interface CandidateMapper {
    CandidateMapper INSTANCE = Mappers.getMapper(CandidateMapper.class);
    @Mapping(source = "user", target = "user")
    CandidateDTO toDTO(Candidate candidate);
    List<CandidateDTO> toDTOList(List<Candidate> candidates);
    @Mapping(source = "user", target = "user")
    Candidate toEntity(CandidateDTO candidateDTO);
}
