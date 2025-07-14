package com.campusdual.bfp.model.dto;

import com.campusdual.bfp.Enumerados.EnumModalidadTrabajo;


import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import java.time.ZonedDateTime;

public class JobOffersDTO {

    private long id;
    private String email;
    private CompanyDTO company;
    private String title;
    private boolean isActive = true;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 4000, message = "La descripción no puede exceder los 4000 caracteres")
    private String description;

    private ZonedDateTime releaseDate;


    private String localizacion;


    private EnumModalidadTrabajo modalidad;


    private String requisitos;


    private String deseables;


    private String beneficios;

    public JobOffersDTO() {
    }

    public JobOffersDTO(long id, String email, CompanyDTO company, String title, String description, ZonedDateTime releaseDate, String localizacion, EnumModalidadTrabajo modalidad, String requisitos, String deseables, String beneficios) {
        this.id = id;
        this.email = email;
        this.company = company;
        this.title = title;
        this.description = description;
        this.releaseDate = releaseDate;
        this.localizacion = localizacion;
        this.modalidad = modalidad;
        this.requisitos = requisitos;
        this.deseables = deseables;
        this.beneficios = beneficios;
    }

    public void validateDescription() {
        if (this.description != null && this.description.length() > 4000) {
            throw new IllegalArgumentException("La descripción excede los 4000 caracteres permitidos");
        }
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
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

    public CompanyDTO getCompany() {
        return company;
    }

    public void setCompany(CompanyDTO company) {
        this.company = company;
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

    public ZonedDateTime getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(ZonedDateTime releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getLocalizacion() {
        return localizacion;
    }

    public void setLocalizacion(String localizacion) {
        this.localizacion = localizacion;
    }


    public EnumModalidadTrabajo getModalidad() {
        return modalidad;
    }

    public void setModalidad(EnumModalidadTrabajo modalidad) {
        this.modalidad = modalidad;
    }


    public String getRequisitos() {
        return requisitos;
    }

    public void setRequisitos(String requisitos) {
        this.requisitos = requisitos;
    }

    public String getDeseables() {
        return deseables;
    }

    public void setDeseables(String deseables) {
        this.deseables = deseables;
    }

    public String getBeneficios() {
        return beneficios;
    }

    public void setBeneficios(String beneficios) {
        this.beneficios = beneficios;
    }
}
