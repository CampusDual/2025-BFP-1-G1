package com.campusdual.bfp.controller;

import com.campusdual.bfp.auth.JWTUtil;
import com.campusdual.bfp.model.User;
import com.campusdual.bfp.model.dto.SignupDTO;
import com.campusdual.bfp.model.dto.UserDTO;
import com.campusdual.bfp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.campusdual.bfp.model.dto.UserDTO;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserService userService;

    @Autowired
    JWTUtil jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        if (authHeader == null || !authHeader.toLowerCase().startsWith("basic ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Header auth is missing.");
        }

        String base64Credentials = authHeader.substring("Basic ".length());
        byte[] credDecoded = Base64.getDecoder().decode(base64Credentials);
        String credentials = new String(credDecoded, StandardCharsets.UTF_8);

        final String[] values = credentials.split(":", 2);
        if (values.length != 2) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Malformed auth header");
        }

        try {
            Authentication authentication = this.authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(values[0], values[1])
            );


            User authenticatedUser = (User) authentication.getPrincipal();

            String token = this.jwtUtils.generateJWTToken(authenticatedUser.getLogin());


            List<String> roles = authenticatedUser.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            UserDTO response = new UserDTO(
                    token,
                    authenticatedUser.getId(),
                    authenticatedUser.getLogin(),
                    authenticatedUser.getName(),
                    authenticatedUser.getEmail(),
                    authenticatedUser.getCif(),
                    authenticatedUser.getTelephone(),
                    authenticatedUser.getAddress(),
                    authenticatedUser.getLogin()

            );

            return ResponseEntity.ok(response);

        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bad credentials");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@RequestBody SignupDTO request) {
        if (this.userService.existsByUsername(request.getLogin())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists.");
        }

        this.userService.registerNewUser(request.getLogin(), request.getPassword());
        return ResponseEntity.status(HttpStatus.CREATED).body("User successfully registered.");
    }
}
