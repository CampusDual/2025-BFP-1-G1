package com.campusdual.bfp.model.dto;

public class UserDataDTO {
    private UserDTO user;
    private CandidateDTO candidate;
    private CompanyDTO company;

    public UserDataDTO() {
    }

    public UserDataDTO(UserDTO user, CandidateDTO candidate, CompanyDTO company) {
        this.user = user;
        this.candidate = candidate;
        this.company = company;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public CandidateDTO getCandidate() {
        return candidate;
    }

    public void setCandidate(CandidateDTO candidate) {
        this.candidate = candidate;
    }

    public CompanyDTO getCompany() {
        return company;
    }

    public void setCompany(CompanyDTO company) {
        this.company = company;
    }
}


