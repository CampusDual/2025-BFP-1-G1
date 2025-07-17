package com.campusdual.bfp.controller;

import com.campusdual.bfp.model.Candidate;
import com.campusdual.bfp.model.dto.CandidateDTO;
import com.campusdual.bfp.model.dto.JobOffersDTO;
import com.campusdual.bfp.model.dto.UserDataDTO;
import com.campusdual.bfp.service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.util.Base64;

@RestController
@RequestMapping("/candidate")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @GetMapping("/testController")
    public String testCandidateController() {
        return "candidate controller works!";
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

    @PutMapping("/update")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateCandidate(@RequestBody CandidateDTO candidate) {
        try {
            CandidateDTO updatedCandidate = candidateService.updateCandidate(candidate);
            return ResponseEntity.ok(updatedCandidate);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    @PutMapping(value = "/update-with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateCandidateWithImage(
            @RequestPart("candidate")  CandidateDTO candidateDto,
            @RequestPart("imageFile") MultipartFile imageFile) {
        try {
            byte[] imageBytes = imageFile.getBytes();
            String base64Image = "data:" + imageFile.getContentType() + ";base64," + Base64.getEncoder().encodeToString(imageBytes);

            candidateDto.setProfileImg(base64Image);
            CandidateDTO updatedCandidate = candidateService.updateCandidate(candidateDto);
            return ResponseEntity.ok(updatedCandidate);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }
}
