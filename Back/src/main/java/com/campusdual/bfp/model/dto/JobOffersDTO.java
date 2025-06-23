package com.campusdual.bfp.model.dto;

import com.campusdual.bfp.model.User;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

public class JobOffersDTO {

    private long id;
    private String email;
    private User user;
    private String title;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 4000, message = "La descripción no puede exceder los 4000 caracteres")
    private String description;

    private LocalDateTime releaseDate;

    // Constructores
    public JobOffersDTO() {
    }

    public JobOffersDTO(long id, String email, User user, String title,
                        String description, LocalDateTime releaseDate) {
        this.id = id;
        this.email = email;
        this.user = user;
        this.title = title;
        this.description = description;
        this.releaseDate = releaseDate;
    }

    // Método de validación
    public void validateDescription() {
        if (this.description != null && this.description.length() > 4000) {
            throw new IllegalArgumentException("La descripción excede los 4000 caracteres permitidos");
        }
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
