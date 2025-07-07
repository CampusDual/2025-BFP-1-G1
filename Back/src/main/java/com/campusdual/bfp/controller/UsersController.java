package com.campusdual.bfp.controller;


import com.campusdual.bfp.model.User;
import com.campusdual.bfp.model.dto.UserDataDTO;
import com.campusdual.bfp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.nio.file.AccessDeniedException;

@RestController
@RequestMapping("/user")
public class UsersController {

    @Autowired
    private UserService userService;

    @GetMapping("/getUser")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> getLoggedUser() {
        try {
            return ResponseEntity.ok(userService.getUserLogged());
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


}