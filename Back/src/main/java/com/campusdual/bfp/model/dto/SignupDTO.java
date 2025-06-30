package com.campusdual.bfp.model.dto;

public class SignupDTO {
    private String login;
    private String password;
    private String email;
    private long role_id;

    public String getLogin() {
        return this.login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public long getRole_id() {
        return this.role_id;
    }

    public void setRole_id(long role_id) {
        this.role_id = role_id;
    }
}
