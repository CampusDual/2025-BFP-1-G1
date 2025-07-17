package com.campusdual.bfp.controller;

import com.campusdual.bfp.auth.JWTUtil;
import com.campusdual.bfp.model.User;
import com.campusdual.bfp.model.dto.UserDTO;
import com.campusdual.bfp.model.dto.UserDataDTO;
import com.campusdual.bfp.service.UserDataService;
import com.campusdual.bfp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campusdual.bfp.exception.RegistrationException;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserService userService;

    @Autowired
    UserDataService userDataService;

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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid authentication header");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(values[0], values[1])
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            User user = (User) authentication.getPrincipal();
            
            // Include role ID in the token
            String token = jwtUtils.generateJWTToken(user.getUsername(), user.getRole().getId());

            List<String> roles = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            UserDTO response = new UserDTO(
                    token,
                    user.getId(),
                    user.getEmail(),
                    user.getLogin(),
                    user.getRole().getId()
            );

            return ResponseEntity.ok(response);

        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bad credentials");
        }
    }

    /**
     * Handles user registration for both candidates and companies
     * @param userDataDTO Contains user data and optionally candidate or company data
     * @return ResponseEntity with the result of the registration
     */
    /**
     * Handles user registration for both candidates and companies
     * @param userDataDTO Contains user data and optionally candidate or company data
     * @return ResponseEntity with the result of the registration
     */
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody UserDataDTO userDataDTO) {
        try {
            UserDataDTO result;
            
            if (userDataDTO.getCandidate() != null) {
                // Candidate registration
                result = userService.registerNewCandidate(userDataDTO.getUser(), userDataDTO.getCandidate());
            } else if (userDataDTO.getCompany() != null) {
                // Company registration (if implemented)
                return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                        .body(Collections.singletonMap("message", "Company registration is not implemented yet"));
            } else {
                // Only user registration (without candidate or company data)
                throw new IllegalArgumentException("Either candidate or company data must be provided");
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User successfully registered.");
            response.put("userId", result.getUser().getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (RegistrationException ex) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("field", ex.getField());
            errorResponse.put("errorCode", ex.getErrorCode());
            errorResponse.put("message", ex.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "An error occurred during registration: " + ex.getMessage()));
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
