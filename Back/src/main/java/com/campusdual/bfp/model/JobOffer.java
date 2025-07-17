package com.campusdual.bfp.model;

import com.campusdual.bfp.Enumerados.EnumModalidadTrabajo;
import com.fasterxml.jackson.annotation.*;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.time.ZonedDateTime;


@Entity
@Table(name = "joboffers")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class JobOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", referencedColumnName = "id")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonBackReference("joboffer-company")
    private Company company;

    @Column
    private String email;

    @Column
    private String title;

    @Column(columnDefinition = "VARCHAR(4000)")
    private String description;

    @Column(name = "release_date")
    private ZonedDateTime releaseDate;

    @Column
    private String localizacion;

    @Column(name = "modalidad", columnDefinition = "EnumModalidad")
    @Type(type = "com.campusdual.bfp.util.PostgresEnumType")
    private EnumModalidadTrabajo modalidad;

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    @Column
    private String requisitos;

    @Column
    private String deseables;

    @Column
    private String beneficios;

    @Column(name = "is_active")
    private Boolean active = false;

    public Boolean getIsActive() {
        return active;
    }


    public void setIsActive(Boolean isActive) {
        this.active = isActive;
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

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
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