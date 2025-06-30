package com.campusdual.bfp.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserDTO {
    private String token;
    private Long id;
    private String email;
    String login;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private int role_id;

    public UserDTO() {}

    public UserDTO(String token, Long id, String email, String login, int role_id) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.login = login;
        this.role_id = role_id;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}