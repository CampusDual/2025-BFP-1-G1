package com.campusdual.bfp.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class UserDTO {
    private String token;
    private Long id;        // <-- ¡Debe ser Long!
    private String username;
    private String name;
    private String email;
    String cif;
    String telephone;
    String address;
    String login;
    @JsonIgnore
    private String password;

    public UserDTO() {}

    public UserDTO(String token, Long id, String username, String name, String email, String cif, String telephone, String address, String login) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.cif = cif;
        this.telephone = telephone;
        this.address = address;
        this.login = login;

    }

    // Getters y Setters para todos los campos
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

}