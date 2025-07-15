package com.campusdual.bfp.controller;

import com.campusdual.bfp.api.IJobOffersService;
import com.campusdual.bfp.model.dto.CandidateDTO;
import com.campusdual.bfp.model.dto.JobOffersDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
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

    @GetMapping(value = "/sort")
    public ResponseEntity<List<JobOffersDTO>> queryAllOffersSorted(@RequestParam String sortBy, @RequestParam String direction) {
        return ResponseEntity.ok(jobOffersService.queryAllOffersSorted(sortBy, direction));
    }

    @GetMapping(value = "/filter")
    public ResponseEntity<List<JobOffersDTO>> queryAllOffersFilter(@RequestParam String filterBy) {
        return ResponseEntity.ok(jobOffersService.queryAllOffersFilter(filterBy));
    }

    @GetMapping(value = "/get/{id}")
    public ResponseEntity<JobOffersDTO> getJobOfferById(@PathVariable int id) {
        JobOffersDTO offer = jobOffersService.queryJobOfferById(id);
        if (offer != null) {
            return ResponseEntity.ok(offer);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private static final Logger logger = LoggerFactory.getLogger(JobOffersController.class);

    @PutMapping("/{id}/status")
    public ResponseEntity<JobOffersDTO> updateJobOfferStatus(
            @PathVariable Long id,
            @RequestParam("active") Boolean active) {
        try {
            JobOffersDTO updatedOffer = jobOffersService.updateJobOfferActiveStatus(id, active);
            logger.info("DTO devuelto por el servicio ANTES de ser enviado al frontend: {}", updatedOffer);

            return new ResponseEntity<>(updatedOffer, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            System.err.println("Error al actualizar el estado de la oferta " + id + ": " + e.getMessage());

            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/update")
    public ResponseEntity<JobOffersDTO> updateJobOffer(@RequestBody JobOffersDTO jobOffersDTO) {
        try {
            JobOffersDTO updated = jobOffersService.updateJobOffer(jobOffersDTO);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // O un 500 si es otro error
        }
    }
@PostMapping(value = "/getcandidatesbyjoboffer")
public ResponseEntity<List<CandidateDTO>> getCandidatesByJobOffer(@RequestBody JobOffersDTO jobOffersDTO) {
    try {
        return ResponseEntity.ok(jobOffersService.getCandidatesByJobOffer(jobOffersDTO));
    }catch (IllegalArgumentException e) {
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}
    @PostMapping(value = "/add")
    public ResponseEntity<Long> insertJobOffer(@RequestBody JobOffersDTO jobOffersDTO) {
        try {
            long newId = jobOffersService.insertJobOffer(jobOffersDTO);
            return new ResponseEntity<>(newId, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            System.err.println("Error al insertar oferta: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /*

    @DeleteMapping(value = "/delete")
    public ResponseEntity<Long> deleteJobOffer(@RequestBody JobOffersDTO jobOffersDTO) {
        try {
            long deletedId = jobOffersService.deleteJobOffer(jobOffersDTO);
            return new ResponseEntity<>(deletedId, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    */
}