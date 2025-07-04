package com.campusdual.bfp.service;

import com.campusdual.bfp.model.Application;
import com.campusdual.bfp.model.dao.ApplicationDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ApplicationService {

    @Autowired
    private ApplicationDao applicationDao;

    public boolean hasAlreadyApplied(Long idCandidate, Long idOffer) {
        return applicationDao.findByIdCandidateAndIdOffer(idCandidate, idOffer).isPresent();
    }

    public Application save(Application application) {
        return applicationDao.save(application);
    }

    public List<Application> getApplicationsByCandidateId(Long candidateId) {
        // Necesitarás un método correspondiente en tu ApplicationDao (JPA Repository)
        return applicationDao.findByIdCandidate(candidateId);
    }
}
