package com.campusdual.bfp.controller;

import com.campusdual.bfp.model.Company;
import com.campusdual.bfp.model.dto.CandidateDTO;
import com.campusdual.bfp.model.dto.CompanyDTO;
import com.campusdual.bfp.model.dto.UserDTO;
import com.campusdual.bfp.model.dto.dtomapper.CompanyMapper;
import com.campusdual.bfp.service.CompanyService;
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
    public ResponseEntity<?> newCompany(@RequestBody CompanyDTO companyDTO, UserDTO userDTO) {
            try {
                return ResponseEntity.ok(companyService.insertNewCompany(companyDTO, userDTO));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
            }
        }


    }


