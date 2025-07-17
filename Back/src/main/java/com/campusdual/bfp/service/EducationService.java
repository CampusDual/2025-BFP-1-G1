package com.campusdual.bfp.service;

import com.campusdual.bfp.model.Education;
import com.campusdual.bfp.model.dao.EducationDao;
import com.campusdual.bfp.model.dto.EducationDTO;
import com.campusdual.bfp.model.dto.dtomapper.EducationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Lazy
public class EducationService {

    @Autowired
    private EducationDao educationDao;

    public EducationDTO queryEducation(EducationDTO educationDTO) {
        return EducationMapper.INSTANCE.toDTO(educationDao.getReferenceById(educationDTO.getId()));
    }

    public List<EducationDTO> queryAllEducations() {
        return EducationMapper.INSTANCE.toDTOList(educationDao.findAll());
    }

    public EducationDTO insertEducation(EducationDTO educationDTO) {
        educationDao.saveAndFlush(EducationMapper.INSTANCE.toEntity(educationDTO));
        return educationDTO;
    }

    public EducationDTO updateEducation(EducationDTO educationDTO) {

        Education education = educationDao.getReferenceById(educationDTO.getId());


        if(educationDTO.getDescription() != null) {
            education.setDescription(educationDTO.getDescription());
        }
        if(educationDTO.getStartPeriod() != null) {
            education.setStartPeriod(educationDTO.getStartPeriod());
        }
        if(educationDTO.getEndPeriod() != null) {
            education.setEndPeriod(educationDTO.getEndPeriod());
        }
        if(educationDTO.getDegree() != null) {
            education.setDegree(educationDTO.getDegree());
        }
        if(educationDTO.getInstitution() != null) {
            education.setInstitution(educationDTO.getInstitution());
        }

        educationDao.saveAndFlush(education);
        return educationDTO;
    }

    public List<EducationDTO> getEducationByCandidateId(long candidateId) {
        return EducationMapper.INSTANCE.toDTOList(educationDao.findByCandidateId(candidateId));
    }
}
