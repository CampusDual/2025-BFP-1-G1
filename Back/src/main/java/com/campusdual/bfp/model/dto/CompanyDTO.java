package com.campusdual.bfp.model.dto;

import com.campusdual.bfp.model.User;

public class CompanyDTO {

    private Long id;
    private String cif;
    private String name;
    private String phone;
    private String address;
    private User user;
    private String web;

    public CompanyDTO() {
    }

    public CompanyDTO(Long id, String cif, String name, String phone, String address, User user, String web) {
        this.id = id;
        this.cif = cif;
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.user = user;
        this.web = web;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getWeb() {
        return web;
    }

    public void setWeb(String web) {
        this.web = web;
    }
}
