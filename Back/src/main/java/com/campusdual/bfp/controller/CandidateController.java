package com.campusdual.bfp.controller;

import com.campusdual.bfp.model.Candidate;
import com.campusdual.bfp.model.dto.CandidateDTO;
import com.campusdual.bfp.model.dto.dtomapper.CandidateMapper;
import com.campusdual.bfp.model.dto.dtomapper.UserMapper;
import com.campusdual.bfp.service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("/candidate")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @GetMapping("/testController")
    public String testCandidateController() {
        return "candidate controller works!";
    }

    @PostMapping("/registerCandidate")
    public ResponseEntity<CandidateDTO> registerCandidate(@RequestBody CandidateDTO candidateDTO) {
        if (candidateDTO.getUser() == null || 
            candidateDTO.getUser().getLogin() == null || 
            candidateDTO.getUser().getPassword() == null) {
            return ResponseEntity.badRequest().build();
        }
        
        try {
            Candidate candidate = candidateService.registerNewCandidate(candidateDTO);
            CandidateDTO result = CandidateMapper.INSTANCE.toDTO(candidate);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/getCandidate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getLoggedCandidate() {
        try {
            Candidate candidate = candidateService.getCandidateLogged();
            return ResponseEntity.ok(candidate);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }
}
