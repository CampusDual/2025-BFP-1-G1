package com.campusdual.bfp.controller;


import com.campusdual.bfp.api.IJobOffersService;
import com.campusdual.bfp.model.User;
import com.campusdual.bfp.model.dto.JobOffersDTO;
import com.campusdual.bfp.model.dto.UserDataDTO;
import com.campusdual.bfp.service.UserDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/offersManagement")
public class OffersManagementController {

    @Autowired
    private IJobOffersService jobOffersService;
    
    @Autowired
    private UserDataService userDataService;

    @GetMapping(value= "/testController")
    public String testJobOffersController() {
        return "offersManagement controller works!";
    }

    @PostMapping(value="/get")
    public JobOffersDTO queryJobOffer(@RequestBody JobOffersDTO jobOffersDTO){
        return jobOffersService.queryJobOffer(jobOffersDTO);

    }

    @GetMapping(value = "/getAll")
    public List<JobOffersDTO> queryAllJobOffer(){
        return jobOffersService.queryAllJobOffer();
    }

    @PostMapping(value="/add")
    public ResponseEntity<?> addJobOffer(@RequestBody JobOffersDTO jobOffersDTO){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof User)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Principal is not a User instance");
        }

        User authenticatedUser = (User) principal;
        if (authenticatedUser.getRole() == null || !(authenticatedUser.getRole().getId() == 2)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User Role must be Company.");
        }

        try {
            long offerId = jobOffersService.insertJobOffer(jobOffersDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(offerId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating job offer: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public long updateJobOffer(@PathVariable long id, @RequestBody JobOffersDTO jobOffersDTO) {

        if (id != jobOffersDTO.getId()) {
            throw new IllegalArgumentException("El ID del path no coincide con el del cuerpo");
        }
        UserDataDTO userData = userDataService.getUserData();
        if (userData.getCompany() == null) {
            throw new SecurityException("El usuario no tiene una compañía asociada");
        }
        JobOffersDTO existingOffer = jobOffersService.queryJobOfferById(id);
        if (existingOffer == null) {
            throw new RuntimeException("No se encontró la oferta con ID: " + id);
        }
        

        if (existingOffer.getCompany() == null || 
            existingOffer.getCompany().getId() != userData.getCompany().getId()) {
            throw new SecurityException("No tienes permiso para modificar esta oferta");
        }
        

        return jobOffersService.updateJobOffer(jobOffersDTO);
    }

/*


    @DeleteMapping (value="/delete")
    public long deleteJobOffer(@RequestBody JobOffersDTO jobOffersDTO){
        return jobOffersService.deleteJobOffer(jobOffersDTO);
    }
*/
}
