package com.campusdual.bfp.model;

import javax.persistence.*;


@Entity
@Table(name="joboffers")
public class JobOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column
    private String email;

    @Column
    private long user_id;

    @Column
    private String title;

    @Column
    private String description;

    public JobOffer() {
    }

    public JobOffer(long id, String email, long user_id, String title) {
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
