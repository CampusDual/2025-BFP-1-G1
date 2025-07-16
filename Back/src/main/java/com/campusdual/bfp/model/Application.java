package com.campusdual.bfp.model;

import javax.persistence.*;
import java.time.LocalDateTime;

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

    @ManyToOne
    @JoinColumn(name = "id_candidate", insertable = false, updatable = false)
    private Candidate candidate;
    @Column(name = "inscription_date", nullable = false, updatable = false) private LocalDateTime inscriptionDate;

    @ManyToOne
    @JoinColumn(name = "id_offer", insertable = false, updatable = false)
    private JobOffer jobOffer;

    public Application() {}

    public Application(Long idCandidate, Long idOffer) {
        this.idCandidate = idCandidate;
        this.idOffer = idOffer;
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