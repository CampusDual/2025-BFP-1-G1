package com.campusdual.bfp.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

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



   /* long id;
    String cif;
    String name;
    String telephone;
    String email;
    String address;
    String login;
    @JsonIgnore
    private String password;


    // Getters y Setters

    public long getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCif() {
        return cif;
    }

    public void setCif(String cif) {
        this.cif = cif;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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
    }*/
}