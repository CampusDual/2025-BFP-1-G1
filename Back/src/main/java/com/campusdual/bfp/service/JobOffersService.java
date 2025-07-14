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

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


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
        return list.stream()
                .filter(jobOffer -> jobOffer.getActive() != null && jobOffer.getActive())
                .map(JobOffersMapper.INSTANCE::toDTO)
                .collect(Collectors.toList());
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
        return jobOffers.stream()
                .filter(jobOffer -> jobOffer.getActive() != null && jobOffer.getActive())
                .map(JobOffersMapper.INSTANCE::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<JobOffersDTO> queryAllOffersFilterByCompany(String filterBy, Long id) {
        if (filterBy == null || filterBy.trim().isEmpty()) {
            return queryAllJobOfferByCompanyId(id);
        }
        List<JobOffer> filteredOffers = jobOffersDao.filterOffersByCompany(filterBy, id);
        return filteredOffers.stream()
                .filter(jobOffer -> jobOffer.getActive() != null && jobOffer.getActive())
                .map(JobOffersMapper.INSTANCE::toDTO)
                .collect(Collectors.toList());
    }


    public List<JobOffersDTO> queryAllOffersFilter(String filterBy) {
        if (filterBy == null || filterBy.trim().isEmpty()) {
            return queryAllJobOffer();
        }
        List<JobOffer> filteredOffers = jobOffersDao.filterOffers(filterBy);
        return filteredOffers.stream()
                .filter(jobOffer -> jobOffer.getActive() != null && jobOffer.getActive())
                .map(JobOffersMapper.INSTANCE::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public JobOffersDTO queryJobOfferById(long id) {
        return jobOffersDao.findById(id).map(JobOffersMapper.INSTANCE::toDTO).orElse(null);
    }


    @Override
    public JobOffersDTO updateJobOffer(JobOffersDTO jobOffersDTO) {
        if (jobOffersDTO.getId() <= 0) {
            throw new IllegalArgumentException("Invalid job offer ID: " + jobOffersDTO.getId());
        }

        JobOffer existingOffer = jobOffersDao.findById(jobOffersDTO.getId())
                .orElseThrow(() -> new RuntimeException("Job offer not found with id: " + jobOffersDTO.getId()));


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
        if (jobOffersDTO.getReleaseDate() != null) {
            existingOffer.setReleaseDate(jobOffersDTO.getReleaseDate());
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

        existingOffer.setActive(jobOffersDTO.isActive());

        jobOffersDao.saveAndFlush(existingOffer);
        return JobOffersMapper.INSTANCE.toDTO(existingOffer);
    }

    public JobOffersDTO updateJobOfferActiveStatus(Long id, Boolean isActive) {
        Optional<JobOffer> offerOptional = jobOffersDao.findById(id);

        if (offerOptional.isPresent()) {
            JobOffer jobOffer = offerOptional.get();
            jobOffer.setActive(isActive);
            JobOffer updatedJobOffer = jobOffersDao.saveAndFlush(jobOffer);
            return JobOffersMapper.INSTANCE.toDTO(updatedJobOffer);
        } else {
            throw new EntityNotFoundException("Oferta de empleo con ID " + id + " no encontrada.");
        }
    }
}