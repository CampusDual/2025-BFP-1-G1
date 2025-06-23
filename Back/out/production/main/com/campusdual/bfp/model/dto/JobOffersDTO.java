package com.campusdual.bfp.model.dto;

import com.campusdual.bfp.model.User;

import java.time.LocalDateTime;

public class JobOffersDTO {

    private long id;
    private String email;
    private User user;
    private String title;
    private String description;
    private LocalDateTime releaseDate;

    public JobOffersDTO() {
    }

    public JobOffersDTO(long id, String email, User user, String title, String description, LocalDateTime releaseDate) {
        this.id = id;
        this.email = email;
        this.user = user;
        this.title = title;
        this.description = description;
        this.releaseDate = releaseDate;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDateTime releaseDate) {
        this.releaseDate = releaseDate;
    }
}
