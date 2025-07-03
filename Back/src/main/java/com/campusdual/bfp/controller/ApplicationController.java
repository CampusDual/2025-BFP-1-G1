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

import java.util.Optional;

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
        // Verifica que la oferta existe
        Optional<JobOffer> offerOpt = jobOffersDao.findById(offerId);
        if (offerOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("La oferta no existe");
        }
        // Verifica si ya ha aplicado
        if (applicationService.hasAlreadyApplied(userData.getCandidate().getId(), offerId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ya estás inscrito a esta oferta");
        }
        // Guarda la aplicación
        Application application = new Application(userData.getCandidate().getId(), offerId);
        applicationService.save(application);
        return ResponseEntity.ok("Aplicación registrada correctamente");
    }
}
