package com.campusdual.bfp.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

public class UserDTO {
    private String token;
    private long id;

    @NotBlank(message = "El email no puede estar vacío.")
    private String email;

    @NotBlank(message = "El nombre de usuario no puede estar vacío.")
    private String login;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(message = "La contraseña no puede estar vacía.")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,}$",
            message = "La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial."
    )
    private String password;

    private long role_id;

    public UserDTO() {}

    public UserDTO(String token, long id, String email, String login, long role_id) {
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

    public long getId() {
        return id;
    }

    public void setId(long id) {
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

    public long getRole_id() {
        return role_id;
    }

    public void setRole_id(long role_id) {
        this.role_id = role_id;
    }
}