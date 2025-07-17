package com.campusdual.bfp.controller;

import com.campusdual.bfp.model.dto.UserDataDTO;
import com.campusdual.bfp.model.dto.WorkExperienceDTO;
import com.campusdual.bfp.service.UserDataService;
import com.campusdual.bfp.service.WorkExperienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/experience")
public class WorkExperienceController {

    @Autowired
    private UserDataService userDataService;

    @Autowired
    private WorkExperienceService workExperienceService;

    @GetMapping("/test")
    public String getExperience() {
        return "Work Experience";
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllWorkExperience() {
        return ResponseEntity.ok(workExperienceService.queryAllWorkExperience());
    }

    @PostMapping("/getExperience")
    public ResponseEntity<?> getWorkExperience(@RequestBody WorkExperienceDTO workExperienceDTO) {
        return ResponseEntity.ok(workExperienceService.queryWorkExperience(workExperienceDTO));
    }

    @GetMapping("candidate/{id}")
    public ResponseEntity<?> getExperienceByCandidate(@PathVariable("id") long candidateId){
        return ResponseEntity.ok(workExperienceService.getWorkExperienceByCandidateId(candidateId));
    }

    @PostMapping("/insertExperience")
    public ResponseEntity<?> insertWorkExperience(@RequestBody WorkExperienceDTO workExperienceDTO) {

        UserDataDTO user = userDataService.getUserData();

        if(user == null) {
            return ResponseEntity.status(400).body("User not found");
        }

        if(user.getCandidate() == null) {
            return ResponseEntity.status(400).body("Candidate not found");
        }

        if(workExperienceDTO.getIdCandidate() != user.getCandidate().getId()) {
            return ResponseEntity.status(400).body("Candidate id does not match");
        }

        return ResponseEntity.ok(workExperienceService.insertWorkExperience(workExperienceDTO));
    }

    @PutMapping("/updateExperience")
    public ResponseEntity<?> updateWorkExperience(@RequestBody WorkExperienceDTO workExperienceDTO) {

        UserDataDTO user = userDataService.getUserData();

        if(user == null) {
            return ResponseEntity.status(400).body("User not found");
        }

        if(user.getCandidate() == null) {
            return ResponseEntity.status(400).body("Candidate not found");
        }

        if(workExperienceDTO.getIdCandidate() != user.getCandidate().getId()) {
            return ResponseEntity.status(400).body("Candidate id does not match");
        }

        WorkExperienceDTO updated = workExperienceService.updateWorkExperience(workExperienceDTO);
        return ResponseEntity.ok(updated);
    }
}
