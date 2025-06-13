package com.campusdual.bfp.model.dto;

public class JobOffersDTO {

    private long id;
    private String email;
    private long user_id;
    private String title;

    public JobOffersDTO() {
    }

    public JobOffersDTO(long id, String email, long user_id, String title) {
        this.id = id;
        this.email = email;
        this.user_id = user_id;
        this.title = title;
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

    public long getUser_id() {
        return user_id;
    }

    public void setUser_id(long user_id) {
        this.user_id = user_id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
