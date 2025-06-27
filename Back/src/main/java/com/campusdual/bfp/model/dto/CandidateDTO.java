package com.campusdual.bfp.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class CandidateDTO {
    private String token;
    private Long id;
    private String login;
    private String name;
    private String username;
    private Long email;        // <-- ¡Debe ser Long!
    private String phone;
    private String role;
    @JsonIgnore
    private String password;

    public CandidateDTO() {
    }

    public CandidateDTO(String token, Long id, String login, String name, String username, Long email, String phone, String role, String password) {
        this.token = token;
        this.id = id;
        this.login = login;
        this.name = name;
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.password = password;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getEmail() {
        return email;
    }

    public void setEmail(Long email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
