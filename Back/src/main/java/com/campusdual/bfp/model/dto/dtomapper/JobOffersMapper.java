package com.campusdual.bfp.model.dto.dtomapper;

import com.campusdual.bfp.model.JobOffer;
import com.campusdual.bfp.model.dto.JobOffersDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface JobOffersMapper {

    JobOffersMapper INSTANCE = Mappers.getMapper(JobOffersMapper.class);

    @Mappings({
        @Mapping(target = "modalidad", source = "modalidad")
    })
    JobOffersDTO toDTO(JobOffer jobOffer);

    @Mappings({
        @Mapping(target = "modalidad", source = "modalidad")
    })
    JobOffer toEntity(JobOffersDTO jobOfferDTO);

    List<JobOffersDTO> toDTOList(List<JobOffer> jobOffer);
}

