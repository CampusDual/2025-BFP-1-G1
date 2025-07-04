package com.campusdual.bfp.model;

import javax.persistence.*;

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

    public Long getIdOffer() {
        return idOffer;
    }

    public void setIdOffer(Long idOffer) {
        this.idOffer = idOffer;
    }
}
