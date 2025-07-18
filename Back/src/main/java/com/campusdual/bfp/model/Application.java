package com.campusdual.bfp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.time.LocalDateTime;
import javax.persistence.PrePersist;

@Entity
@Table(name = "applications")
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_candidate", nullable = false)
    private Long idCandidate;

    @Column(name = "id_offer", nullable = false)
    private Long idOffer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_candidate", insertable = false, updatable = false)
    @JsonIgnore
    private Candidate candidate;


    @Column(name = "inscription_date", nullable = false, updatable = false) private LocalDateTime inscriptionDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_offer", insertable = false, updatable = false)
    private JobOffer jobOffer;

    public Application() {}

    public Application(Long idCandidate, Long idOffer) {
        this.idCandidate = idCandidate;
        this.idOffer = idOffer;
    }
    
    @PrePersist
    protected void onCreate() {
        this.inscriptionDate = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdCandidate() {
        return idCandidate;
    }

    public void setIdCandidate(Long idCandidate) {
        this.idCandidate = idCandidate;
    }

    public LocalDateTime getInscriptionDate() {
        return inscriptionDate;
    }

    public void setInscriptionDate(LocalDateTime inscriptionDate) {
        this.inscriptionDate = inscriptionDate;
    }

    public Long getIdOffer() {
        return idOffer;
    }

    public void setIdOffer(Long idOffer) {
        this.idOffer = idOffer;
    }
}