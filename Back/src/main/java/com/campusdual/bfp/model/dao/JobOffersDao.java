package com.campusdual.bfp.model.dao;

import com.campusdual.bfp.model.Candidate;
import com.campusdual.bfp.model.Company;
import com.campusdual.bfp.model.JobOffer;
import com.campusdual.bfp.model.dto.JobOffersDTO;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobOffersDao extends JpaRepository<JobOffer, Long> {

    List<JobOffer> findByCompanyId(long id);
    List<JobOffer> findAll(Sort sort);

    List<JobOffer> findByCompanyId(long id, Sort sort);
    @Query("SELECT j FROM JobOffer j WHERE (LOWER(j.title) LIKE LOWER(CONCAT('%', :text, '%')) " +
            "OR LOWER(j.description) LIKE LOWER(CONCAT('%', :text, '%')))")
    List<JobOffer> filterOffers(@Param("text") String text);
    @Query("SELECT j FROM JobOffer j WHERE (LOWER(j.title) LIKE LOWER(CONCAT('%', :text, '%')) " +
            "OR LOWER(j.description) LIKE LOWER(CONCAT('%', :text, '%'))) AND j.company.id = :id")
    List<JobOffer> filterOffersByCompany(@Param("text") String text, @Param("id") long id);

    Company findCompanyById(long id);
    List<JobOffer> findByActiveTrue();

    @Query("SELECT c FROM Candidate c, Application a WHERE c.id = a.idCandidate AND a.idOffer = :#{#jobOffersDTO.id}")
    List<Candidate> getCandidatesByJobOffer(JobOffersDTO jobOffersDTO);
    long countByCompany(Company company);

}
