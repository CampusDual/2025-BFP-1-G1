package com.campusdual.bfp.controller;

import com.campusdual.bfp.api.IJobOffersService;
import com.campusdual.bfp.model.dto.JobOffersDTO;
import com.campusdual.bfp.exception.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/jobOffers")
public class JobOffersController {

    @Autowired
    private IJobOffersService jobOffersService;

    @GetMapping(value = "/testController")
    public String testJobOffersController() {
        return "jobOffers controller works!";
    }

    @PostMapping(value = "/get")
    public ResponseEntity<?> queryJobOffer(@RequestBody JobOffersDTO jobOffersDTO) {
        return ResponseEntity.ok(jobOffersService.queryJobOffer(jobOffersDTO));
    }

    @GetMapping(value = "/getAll")
    public ResponseEntity<List<JobOffersDTO>> queryAllJobOffer() {
        return ResponseEntity.ok(jobOffersService.queryAllJobOffer());

    }
    @PostMapping(value = "/create")
    public ResponseEntity<?> createJobOffer(@Valid @RequestBody JobOffersDTO jobOffersDTO) {
        try {
            jobOffersDTO.validateDescription(); // Valida el límite de 4000 caracteres
            long offerId = jobOffersService.insertJobOffer(jobOffersDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(offerId);
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error creating job offer");
        }
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<String> handleValidationException(ValidationException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
    @GetMapping(value = "/sort")
    public ResponseEntity<List<JobOffersDTO>> queryAllOffersSorted(@RequestParam String sortBy, @RequestParam String direction) {
        return ResponseEntity.ok(jobOffersService.queryAllOffersSorted(sortBy, direction));
    }
}