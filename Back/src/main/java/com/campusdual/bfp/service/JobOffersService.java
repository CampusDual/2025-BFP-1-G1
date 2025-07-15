package com.campusdual.bfp.service;

import com.campusdual.bfp.api.IJobOffersService;
import com.campusdual.bfp.model.JobOffer;
import com.campusdual.bfp.model.dao.JobOffersDao;
import com.campusdual.bfp.model.dto.JobOffersDTO;
import com.campusdual.bfp.model.dto.dtomapper.JobOffersMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Importar Transactional

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@Lazy
public class JobOffersService implements IJobOffersService {
    private static final Logger logger = LoggerFactory.getLogger(JobOffersService.class); // Añadir esto


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
                .filter(jobOffer -> jobOffer.getIsActive() != null && jobOffer.getIsActive())
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
    @Transactional
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
                .filter(jobOffer -> jobOffer.getIsActive() != null && jobOffer.getIsActive())
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
                .filter(jobOffer -> jobOffer.getIsActive() != null && jobOffer.getIsActive())
                .map(JobOffersMapper.INSTANCE::toDTO)
                .collect(Collectors.toList());
    }


    public List<JobOffersDTO> queryAllOffersFilter(String filterBy) {
        if (filterBy == null || filterBy.trim().isEmpty()) {
            return queryAllJobOffer();
        }
        List<JobOffer> filteredOffers = jobOffersDao.filterOffers(filterBy);
        return filteredOffers.stream()
                .filter(jobOffer -> jobOffer.getIsActive() != null && jobOffer.getIsActive())
                .map(JobOffersMapper.INSTANCE::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public JobOffersDTO queryJobOfferById(long id) {
        return jobOffersDao.findById(id).map(JobOffersMapper.INSTANCE::toDTO).orElse(null);
    }


    @Override
    @Transactional
    public JobOffersDTO updateJobOffer(JobOffersDTO jobOffersDTO) {
        if (jobOffersDTO.getId() <= 0) {
            throw new IllegalArgumentException("Invalid job offer ID: " + jobOffersDTO.getId());
        }

        JobOffer existingOffer = jobOffersDao.findById(jobOffersDTO.getId())
                .orElseThrow(() -> new EntityNotFoundException("Job offer not found with id: " + jobOffersDTO.getId())); // Usar EntityNotFoundException

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

        existingOffer.setIsActive(jobOffersDTO.isActive());


        jobOffersDao.saveAndFlush(existingOffer);
        return JobOffersMapper.INSTANCE.toDTO(existingOffer);
    }


    @Transactional
    public JobOffersDTO updateJobOfferActiveStatus(Long id, Boolean isActive) {
        logger.info("Intentando actualizar el estado de la oferta con ID: {} a isActive: {}", id, isActive);

        Optional<JobOffer> offerOptional = jobOffersDao.findById(id);

        if (offerOptional.isPresent()) {
            JobOffer jobOffer = offerOptional.get();
            logger.info("Oferta encontrada. Estado actual en la entidad ANTES de setear: {}", jobOffer.getIsActive());

            jobOffer.setIsActive(isActive);
            logger.info("Estado de la entidad DESPUÉS de setear: {}", jobOffer.getIsActive());

            JobOffer updatedJobOffer = jobOffersDao.saveAndFlush(jobOffer);
            logger.info("Oferta guardada en la base de datos. Estado devuelto por saveAndFlush: {}", updatedJobOffer.getIsActive());

            return JobOffersMapper.INSTANCE.toDTO(updatedJobOffer);
        } else {
            logger.warn("Oferta de empleo con ID {} no encontrada.", id);
            throw new EntityNotFoundException("Oferta de empleo con ID " + id + " no encontrada.");
        }
    }
}