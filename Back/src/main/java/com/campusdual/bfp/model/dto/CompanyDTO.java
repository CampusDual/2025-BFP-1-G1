package com.campusdual.bfp.model.dto;

public class CompanyDTO {

    private Long id;
    private String cif;
    private String name;
    private String phone;
    private String address;
    private UserDTO user;
    private String web;
    private String logo;

    public CompanyDTO() {
    }

    public CompanyDTO(Long id, String cif, String name, String phone, String address, UserDTO user, String web, String logo) {
        this.id = id;
        this.cif = cif;
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.user = user;
        this.web = web;
        this.logo = logo;
    }

    public long getId() {
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

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public String getWeb() {
        return web;
    }

    public void setWeb(String web) {
        this.web = web;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }
}
