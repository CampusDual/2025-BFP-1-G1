package com.campusdual.bfp.controller;

import com.campusdual.bfp.model.Admin;
import com.campusdual.bfp.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @GetMapping("/testController")
    public String testAdminController() {
        return "admin controller works!";
    }

    @GetMapping("/getAdmin")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getAdminLogged() {
        try {
            Admin admin = adminService.getAdminLogged();
            return ResponseEntity.ok(admin);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }
}
