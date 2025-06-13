package com.campusdual.bfp.model.dto.dtomapper;

import com.campusdual.bfp.model.JobOffer;
import com.campusdual.bfp.model.dto.JobOffersDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface JobOffersMapper {

    JobOffersMapper INSTANCE = Mappers.getMapper(JobOffersMapper.class);

    JobOffersDTO toDTO(JobOffer jobOffer);
    List<JobOffersDTO> toDTOList(List<JobOffer> jobOffer);
    JobOffer toEntity(JobOffersDTO jobOfferDTO);
}
