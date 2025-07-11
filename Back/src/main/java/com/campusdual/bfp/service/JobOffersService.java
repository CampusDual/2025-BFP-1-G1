package com.campusdual.bfp.service;

import com.campusdual.bfp.api.IJobOffersService;
import com.campusdual.bfp.model.JobOffer;
import com.campusdual.bfp.model.dao.JobOffersDao;
import com.campusdual.bfp.model.dto.JobOffersDTO;
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

    @Override
    public List<JobOffersDTO> queryAllJobOffer() {
        List<JobOffer> list = jobOffersDao.findAll();
        List<JobOffersDTO> listDto = JobOffersMapper.INSTANCE.toDTOList(list);
        return listDto;
    }

    @Override
    public List<JobOffersDTO> queryAllJobOfferByCompanyId(long id) {
        return JobOffersMapper.INSTANCE.toDTOList(jobOffersDao.findByCompanyId(id));
    }

    @Override
    public List<JobOffersDTO> queryAllJobOfferByCompanyIdSorted(long id, String sortBy, String direction) {
        if (!List.of("title", "company", "releaseDate").contains(sortBy)) {
            throw new IllegalArgumentException("Invalid sort field: " + sortBy);
        }
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(sortDirection, sortBy);
        List<JobOffer> jobOffers = jobOffersDao.findByCompanyId(id, sort);
        return JobOffersMapper.INSTANCE.toDTOList(jobOffers);
    }


    @Override
    public long insertJobOffer(JobOffersDTO jobOffersDTO) {
        if (jobOffersDTO.getModalidad() == null) {
            throw new IllegalArgumentException("La modalidad es un campo requerido");
        }

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
        if (!List.of("title", "company", "releaseDate").contains(sortBy)) {
            throw new IllegalArgumentException("Invalid sort field: " + sortBy);
        }
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(sortDirection, sortBy);
        List<JobOffer> jobOffers = jobOffersDao.findAll(sort);
        return JobOffersMapper.INSTANCE.toDTOList(jobOffers);
    }

    @Override
    public List<JobOffersDTO> queryAllOffersFilterByCompany(String filterBy, Long id) {
        if (filterBy == null || filterBy.trim().isEmpty()) {
            return queryAllJobOffer();
        }
        return JobOffersMapper.INSTANCE.toDTOList(jobOffersDao.filterOffersByCompany(filterBy, id));
    }


    public List<JobOffersDTO> queryAllOffersFilter(String filterBy) {
        if (filterBy == null || filterBy.trim().isEmpty()) {
            return queryAllJobOffer();
        }
        return JobOffersMapper.INSTANCE.toDTOList(jobOffersDao.filterOffers(filterBy));
    }

    @Override
    public JobOffersDTO queryJobOfferById(long id) {
        return jobOffersDao.findById(id).map(JobOffersMapper.INSTANCE::toDTO).orElse(null);
    }


    @Override
    public long updateJobOffer(JobOffersDTO jobOffersDTO) {

        if (jobOffersDTO.getId() <= 0) {
            throw new IllegalArgumentException("Invalid job offer ID: " + jobOffersDTO.getId());
        }

        JobOffer existingOffer = jobOffersDao.findById(jobOffersDTO.getId())
            .orElseThrow(() -> new RuntimeException("Job offer not found with id: " + jobOffersDTO.getId()));

        // Update only the allowed fields
        if (jobOffersDTO.getTitle() != null) {
            existingOffer.setTitle(jobOffersDTO.getTitle());
        }
        if (jobOffersDTO.getDescription() != null) {
            existingOffer.setDescription(
                jobOffersDTO.getDescription().substring(0, Math.min(jobOffersDTO.getDescription().length(), 4000))
            );
        }
        if (jobOffersDTO.getEmail() != null) {
            existingOffer.setEmail(jobOffersDTO.getEmail());
        }
        if (jobOffersDTO.getLocalizacion() != null) {
            existingOffer.setLocalizacion(jobOffersDTO.getLocalizacion());
        }
        if (jobOffersDTO.getModalidad() != null) {
            existingOffer.setModalidad(jobOffersDTO.getModalidad());
        }
        if (jobOffersDTO.getRequisitos() != null) {
            existingOffer.setRequisitos(jobOffersDTO.getRequisitos());
        }
        if (jobOffersDTO.getDeseables() != null) {
            existingOffer.setDeseables(jobOffersDTO.getDeseables());
        }
        if (jobOffersDTO.getBeneficios() != null) {
            existingOffer.setBeneficios(jobOffersDTO.getBeneficios());
        }

        // Save the updated entity
        jobOffersDao.saveAndFlush(existingOffer);
        return existingOffer.getId();
    }

    /*  TODO implementar métodos.


    @Override
    public long deleteJobOffer(JobOffersDTO jobOffersDTO) {
        long id = jobOffersDTO.getId();
        JobOffer jobOffer = JobOffersMapper.INSTANCE.toEntity(jobOffersDTO);
        jobOffersDao.delete(jobOffer);
        return id;
    }*/
}
