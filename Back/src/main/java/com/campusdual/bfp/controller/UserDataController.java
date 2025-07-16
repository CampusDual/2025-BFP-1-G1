package com.campusdual.bfp.controller;

import com.campusdual.bfp.model.dto.UserDataDTO;
import com.campusdual.bfp.service.UserDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/userdata")
public class UserDataController {
    @Autowired
    private UserDataService userDataService;
    @GetMapping("/getuserdata")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserData() {
        try {
            UserDataDTO userData = userDataService.getUserData();
            return ResponseEntity.ok(userData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserDataById(@PathVariable Long id) { 
        try {

            UserDataDTO userData = userDataService.getUserDataById(id);
            if (userData != null) {
                return ResponseEntity.ok(userData);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User data not found for ID: " + id);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

}
