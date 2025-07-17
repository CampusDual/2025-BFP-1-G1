package com.campusdual.bfp.controller;

import com.campusdual.bfp.model.Application;
import com.campusdual.bfp.model.JobOffer;
import com.campusdual.bfp.model.dto.CandidateDTO;
import com.campusdual.bfp.model.dto.UserDataDTO;
import com.campusdual.bfp.model.dto.dtomapper.CandidateMapper;
import com.campusdual.bfp.service.UserDataService;
import com.campusdual.bfp.model.dao.JobOffersDao;
import com.campusdual.bfp.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private JobOffersDao jobOffersDao;

    @Autowired
    private UserDataService userDataService;


    @PostMapping("/apply")
    public ResponseEntity<String> applyToOffer(@RequestParam Long offerId, Authentication authentication) {
        UserDataDTO userData = userDataService.getUserData();

        if (userData.getUser() == null || userData.getUser().getRole_id() != 3L) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Only users with a 'candidate' role can apply to offers.");
        }
        if (userData.getCandidate() == null || userData.getCandidate().getId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid candidate data: Candidate profile not found or incomplete.");
        }

        Optional<JobOffer> offerOpt = jobOffersDao.findById(offerId);
        if (offerOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Job offer not found.");
        }

        if (applicationService.hasAlreadyApplied(userData.getCandidate().getId(), offerId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("You have already applied to this job offer.");
        }

        Application application = new Application(userData.getCandidate().getId(), offerId);
        applicationService.save(application);
        return ResponseEntity.ok("Application registered successfully.");
    }


    @GetMapping("/user")
    public ResponseEntity<?> getUserApplications(Authentication authentication) {
        UserDataDTO userData = userDataService.getUserData();
        if (userData.getUser() == null || userData.getUser().getRole_id() != 3L) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Only candidates can view their applications.");
        }
        if (userData.getCandidate() == null || userData.getCandidate().getId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Candidate data not found or incomplete.");
        }

        List<Application> userApplications = applicationService.getApplicationsByCandidateId(userData.getCandidate().getId());

        List<Map<String, Long>> offerIds = userApplications.stream()
                .map(app -> {
                    Map<String, Long> map = new HashMap<>();
                    map.put("offerId", app.getIdOffer());
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(offerIds);
    }


    @GetMapping("/offer/{offerId}")
    public ResponseEntity<List<Application>> getApplicationsByOfferId(@RequestHeader("Authorization") String token,
                                                                      @PathVariable Long offerId) {

        List<Application> applications = applicationService.getApplicationsByOfferId(offerId);
        return ResponseEntity.ok(applications);
    }


    @GetMapping("/{applicationId}")
    public ResponseEntity<Application> getApplicationById(@RequestHeader("Authorization") String token,
                                                          @PathVariable Long applicationId) {
        return applicationService.getApplicationById(applicationId)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
    }


    @GetMapping("/getcandidates/{idoffer}")
    @PreAuthorize("isAuthenticated()") // Ensure the user is authenticated
    public ResponseEntity<?> getCandidatesByJobOffer(@PathVariable Long idoffer) {
        UserDataDTO userData = userDataService.getUserData();

        if (userData.getUser() == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Error: No user information found in the token. Please ensure you are logged in.");
        }

        if (userData.getCompany() == null || userData.getCompany().getId() < 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: No company information found for this user. Please ensure your company profile is complete.");
        }

        Optional<JobOffer> jobOfferOpt = jobOffersDao.findById(idoffer);
        if (jobOfferOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND) // Changed from FORBIDDEN to NOT_FOUND for clarity
                    .body("Error: Job offer with ID " + idoffer + " not found.");
        }

        JobOffer jobOffer = jobOfferOpt.get();

        if (!Objects.equals(jobOffer.getCompany() != null ? jobOffer.getCompany().getId() : null, userData.getCompany().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Error: This job offer does not belong to your company. You can only view candidates for your own job offers.");
        }

        List<CandidateDTO> candidates = CandidateMapper.INSTANCE.toDTOList(applicationService.getCandidatesByJobOfferId(idoffer));
        return ResponseEntity.ok(candidates);
    }

    @GetMapping("/getapplications/{idoffer}/{idcandidate}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Application> getApplication(
            @PathVariable Long idcandidate,
            @PathVariable Long idoffer
    ) {
        Application application = applicationService.getApplicationByIdCandidateAndIdOffer(idcandidate, idoffer);
        return ResponseEntity.ok(application);
    }
}