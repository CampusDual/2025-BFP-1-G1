package com.campusdual.bfp.controller;

import com.campusdual.bfp.model.Company;
import com.campusdual.bfp.model.dto.CandidateDTO;
import com.campusdual.bfp.model.dto.CompanyDTO;
import com.campusdual.bfp.model.dto.UserDTO;
import com.campusdual.bfp.model.dto.UserDataDTO;
import com.campusdual.bfp.model.dto.dtomapper.CompanyMapper;
import com.campusdual.bfp.service.CompanyService;
import com.campusdual.bfp.service.UserDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
@RestController
@RequestMapping("/company")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @Autowired
    private UserDataService userDataService;


    @GetMapping("/testController")
    public String testCompanyController() {
        return "company controller works!";
    }


    @GetMapping("/getCompany")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getLoggedCompany() {
        try {
            Company company = companyService.getCompanyLogged();
            return ResponseEntity.ok(company);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/getAllCompanies")
    public ResponseEntity<?> getAllCompanies() {
        try {
            return ResponseEntity.ok(companyService.queryAllCompanies());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    @PostMapping("/newCompany")
    public ResponseEntity<?> newCompany(@RequestBody UserDataDTO userDataDTO) {
        try {
            return ResponseEntity.ok(companyService.insertNewCompany(userDataDTO));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("ya existe")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                        java.util.Collections.singletonMap("message", e.getMessage())
                );
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }


    @GetMapping("/{id}/job-offers-count")
    @PreAuthorize("authentication.principal.role.id == 1")
    public ResponseEntity<?> getJobOffersCount(@PathVariable long id) {
        try {
            long count = companyService.countJobOffersByCompany(id);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }

    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("authentication.principal.role.id == 1")
    public ResponseEntity<?> deleteCompany(@PathVariable long id) {
        try {
            companyService.deleteCompany(id);
            return ResponseEntity.ok("Company with id " + id + " deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("authentication.principal.role.id == 1")
    public ResponseEntity<?> updateCompany(@PathVariable long id, @RequestBody CompanyDTO companyDTO) {
        if (id != companyDTO.getId()) {
            return ResponseEntity.badRequest().body("The id in the path and the id in the request body must be the same.");
        }
        UserDataDTO userData = userDataService.getUserData();
        if (userData.getUser().getRole_id() != 1L) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to update this company.");
        }

        Company updatedCompany = companyService.updateCompany(companyDTO);
        CompanyDTO updatedCompanyDTO = CompanyMapper.INSTANCE.toDTO(updatedCompany);

        return ResponseEntity.ok(updatedCompanyDTO);
    }
}


