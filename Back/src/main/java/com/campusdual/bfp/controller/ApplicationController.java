package com.campusdual.bfp.controller;

import com.campusdual.bfp.model.Application;

import com.campusdual.bfp.model.JobOffer;
import com.campusdual.bfp.model.dto.UserDataDTO;
import com.campusdual.bfp.service.UserDataService;

import com.campusdual.bfp.model.dao.JobOffersDao;
import com.campusdual.bfp.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;


    @Autowired
    private JobOffersDao jobOffersDao;

    @Autowired
    private UserDataService userDataService;

    @PostMapping("/apply")
    public ResponseEntity<?> applyToOffer(@RequestParam Long offerId, Authentication authentication) {
        UserDataDTO userData = userDataService.getUserData();
        if (userData.getUser() == null || userData.getUser().getRole_id() != 3L) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo los usuarios con rol de candidato pueden aplicar a ofertas");
        }
        if (userData.getCandidate() == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo los candidatos pueden aplicar a ofertas");
        }

        Optional<JobOffer> offerOpt = jobOffersDao.findById(offerId);
        if (offerOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("La oferta no existe");
        }

        if (applicationService.hasAlreadyApplied(userData.getCandidate().getId(), offerId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya estás inscrito a esta oferta");
        }

        Application application = new Application(userData.getCandidate().getId(), offerId);
        applicationService.save(application);
        return ResponseEntity.ok("Aplicación registrada correctamente");
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserApplications(Authentication authentication) {
        UserDataDTO userData = userDataService.getUserData();

        if (userData.getUser() == null || userData.getUser().getRole_id() != 3L) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acceso denegado. Solo los candidatos pueden ver sus aplicaciones.");
        }
        if (userData.getCandidate() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Datos de candidato no encontrados.");
        }

        Long candidateId = userData.getCandidate().getId();
        if (candidateId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("ID de candidato no disponible.");
        }


        List<Application> userApplications = applicationService.getApplicationsByCandidateId(candidateId);

        List<Map<String, Long>> offerIds = userApplications.stream()
                .map(app -> {
                    Map<String, Long> map = new HashMap<>();
                    map.put("offerId", app.getIdOffer());
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(offerIds);
    }
}
