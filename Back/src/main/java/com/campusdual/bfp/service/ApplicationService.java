package com.campusdual.bfp.service;

import com.campusdual.bfp.model.Application;
import com.campusdual.bfp.model.Candidate;
import com.campusdual.bfp.model.JobOffer;
import com.campusdual.bfp.model.dao.ApplicationDao;
import com.campusdual.bfp.model.dao.CandidateDao;
import com.campusdual.bfp.model.dao.JobOffersDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationDao applicationDao;


    @Autowired
    private JobOffersDao jobOffersDao;

    @Autowired
    private CandidateDao candidateDao;


    public boolean hasAlreadyApplied(Long idCandidate, Long idOffer) {
        return applicationDao.findByIdCandidateAndIdOffer(idCandidate, idOffer).isPresent();
    }

    public Application save(Application application) {
        return applicationDao.save(application);
    }



    @Transactional // Usar si las relaciones de JobOffer o Candidate en Application son LAZY y quieres que se carguen
    public List<Application> getApplicationsByCandidateId(Long candidateId) {
        return applicationDao.findByIdCandidate(candidateId);
    }

    @Transactional // Usar si las relaciones de JobOffer o Candidate en Application son LAZY y quieres que se carguen
    public List<Application> getApplicationsByOfferId(Long offerId) {
        return applicationDao.findByJobOfferId(offerId);
    }

    @Transactional // Usar si las relaciones de JobOffer o Candidate en Application son LAZY y quieres que se carguen
    public Optional<Application> getApplicationById(Long applicationId) {
        return applicationDao.findById(applicationId);
    }

    @Transactional
    public String applyForOffer(Long candidateId, Long offerId) {
        JobOffer jobOffer = jobOffersDao.findById(offerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job offer not found"));

        if (applicationDao.findByIdCandidateAndJobOfferId(candidateId, offerId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already applied to this offer");
        }

        Application application = new Application();
        application.setIdCandidate(candidateId);
        application.setIdOffer(jobOffer.getId());
        application.setInscriptionDate(LocalDateTime.now());
       // application.setStatus(Application.ApplicationStatus.PENDING);

        applicationDao.save(application);
        return "Application successful!";
    }
@Transactional
    public List<Candidate> getCandidatesByJobOfferId(Long jobOfferId) {
        List<Application> applications = applicationDao.findByJobOfferId(jobOfferId);
        List<Long> candidateIds = applications.stream()
                .map(Application::getIdCandidate)

                .distinct()

                .collect(Collectors.toList());


        return candidateDao.findByIdIn(candidateIds);

    }


}
