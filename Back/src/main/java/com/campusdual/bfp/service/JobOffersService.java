package com.campusdual.bfp.service;

import com.campusdual.bfp.api.IJobOffersService;
import com.campusdual.bfp.model.Company;
import com.campusdual.bfp.model.JobOffer;
import com.campusdual.bfp.model.dao.JobOffersDao;
import com.campusdual.bfp.model.dto.JobOffersDTO;
import com.campusdual.bfp.model.dto.UserDataDTO;
import com.campusdual.bfp.model.dto.dtomapper.JobOffersMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@Lazy
public class JobOffersService implements IJobOffersService {

    @Autowired
    private JobOffersDao jobOffersDao;


    @Override
    public JobOffersDTO queryJobOffer(JobOffersDTO jobOffersDTO) {
       JobOffer jobOffer = JobOffersMapper.INSTANCE.toEntity(jobOffersDTO);
       return JobOffersMapper.INSTANCE.toDTO(jobOffersDao.getReferenceById(jobOffer.getId()));

    }

    // TODO mejorar la seguridad de los metodos comprobando si el usuario es el dueño de la oferta
    @Override
    public List<JobOffersDTO> queryAllJobOffer() {
        List<JobOffer> list= jobOffersDao.findAll();
        List<JobOffersDTO>listDto= JobOffersMapper.INSTANCE.toDTOList(list);;
        return listDto;
    }

    @Override
    public List<JobOffersDTO> queryAllJobOfferByCompanyId(long id) {
        return JobOffersMapper.INSTANCE.toDTOList(jobOffersDao.findByCompanyId(id));
    }


    @Override
    public long insertJobOffer(JobOffersDTO jobOffersDTO) {

        jobOffersDTO.validateDescription();

        if (jobOffersDTO.getDescription() != null) {
            jobOffersDTO.setDescription(
                    jobOffersDTO.getDescription().substring(0, Math.min(jobOffersDTO.getDescription().length(), 4000))
            );
        }
        JobOffer jobOffer = JobOffersMapper.INSTANCE.toEntity(jobOffersDTO);
        jobOffersDao.saveAndFlush(jobOffer);
        return jobOffer.getId();
    }

    public List<JobOffersDTO> queryAllOffersSorted(String sortBy, String direction) {
        if(!List.of("title", "company", "releaseDate").contains(sortBy)) {
            throw new IllegalArgumentException("Invalid sort field: " + sortBy);
        }
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(sortDirection, sortBy);
        List<JobOffer> jobOffers = jobOffersDao.findAll(sort);
     return JobOffersMapper.INSTANCE.toDTOList(jobOffers);
    }


  /*  TODO implementar métodos.
  @Override
    public long updateJobOffer(JobOffersDTO jobOffersDTO) {
        return insertJobOffer(jobOffersDTO);
    }

    @Override
    public long deleteJobOffer(JobOffersDTO jobOffersDTO) {
        long id = jobOffersDTO.getId();
        JobOffer jobOffer = JobOffersMapper.INSTANCE.toEntity(jobOffersDTO);
        jobOffersDao.delete(jobOffer);
        return id;
    }*/
}
