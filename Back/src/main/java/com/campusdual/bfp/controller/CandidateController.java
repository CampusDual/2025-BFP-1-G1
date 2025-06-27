package com.campusdual.bfp.controller;

import com.campusdual.bfp.model.Candidate;
import com.campusdual.bfp.model.User;
import com.campusdual.bfp.service.CandidateService;
import com.campusdual.bfp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("/candidate")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @GetMapping("/getCandidate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getLoggedCandidate() {
        try {
            Candidate candidate = candidateService.getUserLogged();
            return ResponseEntity.ok(candidate);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }
}







