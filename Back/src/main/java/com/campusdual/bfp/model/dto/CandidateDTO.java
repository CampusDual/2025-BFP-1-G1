package com.campusdual.bfp.model.dto;

import com.campusdual.bfp.model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;
import java.util.Date;

public class CandidateDTO {
    private Long id;
    private String name;
    private String surname;
    private String phone;
    private UserDTO user;
    private Date birthDate;

    public CandidateDTO() {
    }

    public CandidateDTO( Long id,  String name, String surname,  String phone, UserDTO user, Date birthDate) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.phone = phone;
        this.user = user;
        this.birthDate = birthDate;

    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }
}
