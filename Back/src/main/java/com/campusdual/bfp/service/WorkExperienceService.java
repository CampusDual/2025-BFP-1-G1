package com.campusdual.bfp.service;

import com.campusdual.bfp.model.WorkExperience;
import com.campusdual.bfp.model.dao.WorkExperienceDao;

import com.campusdual.bfp.model.dto.WorkExperienceDTO;

import com.campusdual.bfp.model.dto.dtomapper.WorkExperienceMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Lazy
public class WorkExperienceService {

    @Autowired
    private WorkExperienceDao workExperienceDao;

    public WorkExperienceDTO queryWorkExperience(WorkExperienceDTO workExperienceDTO) {

        return WorkExperienceMapper.INSTANCE.toDTO(workExperienceDao.getReferenceById(workExperienceDTO.getId()));
    }

    public List<WorkExperienceDTO> queryAllWorkExperience() {
        return WorkExperienceMapper.INSTANCE.toDTOList(workExperienceDao.findAll()); }

    public WorkExperienceDTO insertWorkExperience(WorkExperienceDTO workExperienceDTO) {
        workExperienceDao.saveAndFlush(WorkExperienceMapper.INSTANCE.toEntity(workExperienceDTO));
        return workExperienceDTO;
    }

    public WorkExperienceDTO updateWorkExperience(WorkExperienceDTO workExperienceDTO) {

        WorkExperience workExperience = workExperienceDao.getReferenceById(workExperienceDTO.getId());

        if(workExperienceDTO.getDescription() != null) {
            workExperience.setDescription(workExperienceDTO.getDescription());
        }
        if(workExperienceDTO.getStartPeriod() != null) {
            workExperience.setStartPeriod(workExperienceDTO.getStartPeriod());
        }
        if(workExperienceDTO.getEndPeriod() != null) {
            workExperience.setEndPeriod(workExperienceDTO.getEndPeriod());
        }
        if(workExperienceDTO.getJobTitle() != null) {
            workExperience.setJobTitle(workExperienceDTO.getJobTitle());
        }
        if(workExperienceDTO.getCompany() != null) {
            workExperience.setCompany(workExperienceDTO.getCompany());
        }

        workExperienceDao.saveAndFlush(workExperience);
        return workExperienceDTO;
    }

    public List<WorkExperienceDTO> getWorkExperienceByCandidateId(long candidateId) {
        return WorkExperienceMapper.INSTANCE.toDTOList(workExperienceDao.findByCandidateId(candidateId));
    }
}
