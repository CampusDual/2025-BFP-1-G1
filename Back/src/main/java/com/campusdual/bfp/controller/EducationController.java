package com.campusdual.bfp.controller;

import com.campusdual.bfp.model.dto.EducationDTO;
import com.campusdual.bfp.model.dto.UserDataDTO;
import com.campusdual.bfp.service.EducationService;
import com.campusdual.bfp.service.UserDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/education")
public class EducationController {

    @Autowired
    private EducationService educationService;

    @Autowired
    private UserDataService userDataService;


    @GetMapping("/test")
    public String getEducation() {
        return "Education works";
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllEducation() {
        return ResponseEntity.ok(educationService.queryAllEducations());
    }

    @PostMapping("/getEducation")
    public ResponseEntity<?> getEducation(@RequestBody EducationDTO educationDTO) {
        return ResponseEntity.ok(educationService.queryEducation(educationDTO));
    }

    @PostMapping("/insertEducation")
    public ResponseEntity<?> insertEducation(@RequestBody EducationDTO educationDTO) {

        UserDataDTO user = userDataService.getUserData();

        if(user == null) {
            return ResponseEntity.status(400).body("User not found");
        }

        if(user.getCandidate() == null) {
            return ResponseEntity.status(400).body("Candidate not found");
        }

        if(educationDTO.getIdCandidate() != user.getCandidate().getId()) {
            return ResponseEntity.status(400).body("Candidate id does not match");
        }

        return ResponseEntity.ok(educationService.insertEducation(educationDTO));
    }

    @PutMapping("/updateEducation")
    public ResponseEntity<?> updateEducation(@RequestBody EducationDTO educationDTO) {

        UserDataDTO user = userDataService.getUserData();

        if(user == null) {
            return ResponseEntity.status(400).body("User not found");
        }

        if(user.getCandidate() == null) {
            return ResponseEntity.status(400).body("Candidate not found");
        }

        if(educationDTO.getIdCandidate() != user.getCandidate().getId()) {
            return ResponseEntity.status(400).body("Candidate id does not match");
        }

        return ResponseEntity.ok(educationService.updateEducation(educationDTO));
    }
}

