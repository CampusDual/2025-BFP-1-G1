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

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDataDTO userDataDTO) {
        try {
            UserDataDTO result = userService.registerNewCandidate(
                    userDataDTO.getUser(),
                    userDataDTO.getCandidate()
            );
            return ResponseEntity.ok(result);
        } catch (RuntimeException ex) {
            if (ex.getMessage().contains("usuario ya existe") || ex.getMessage().contains("email ya existe")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(java.util.Collections.singletonMap("message", ex.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Collections.singletonMap("message", ex.getMessage()));
        }
    }


}