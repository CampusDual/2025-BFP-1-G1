package com.campusdual.bfp.service;

import com.campusdual.bfp.model.Company;
import com.campusdual.bfp.model.JobOffer;
import com.campusdual.bfp.model.Role;
import com.campusdual.bfp.model.User;
import com.campusdual.bfp.model.dao.CompanyDao;
import com.campusdual.bfp.model.dao.JobOffersDao;
import com.campusdual.bfp.model.dao.RoleDao;
import com.campusdual.bfp.model.dao.UserDao;
import com.campusdual.bfp.model.dto.CompanyDTO;
import com.campusdual.bfp.model.dto.JobOffersDTO;
import com.campusdual.bfp.model.dto.UserDTO;
import com.campusdual.bfp.model.dto.UserDataDTO;
import com.campusdual.bfp.model.dto.dtomapper.CompanyMapper;
import com.campusdual.bfp.model.dto.dtomapper.JobOffersMapper;
import com.campusdual.bfp.model.dto.dtomapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
@Lazy
public class CompanyService {

    public static final long COMPANY_ROLE = 2;

    @Autowired
    private CompanyDao companyDao;

    @Autowired
    private JobOffersDao jobOffersDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserService userService;

    @Autowired
    private RoleDao roleDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public boolean existsByName(String name) {
        Company company = this.companyDao.findByName(name);
        return company != null;
    }

    @Transactional(readOnly = true)
    public Company getCompanyLogged() throws AccessDeniedException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserDetails) {
            String username = ((UserDetails) auth.getPrincipal()).getUsername();
            Company company = companyDao.findByUserLogin(username);
            if (company != null) {
                return company;
            }
        }

        throw new AccessDeniedException("Authenticated principal is not a valid User instance or user not found. Access Denied.");
    }

    @Transactional(readOnly = true)
    public List<CompanyDTO> queryAllCompanies() {
        return CompanyMapper.INSTANCE.toDTOList(this.companyDao.findAll());
    }

    @Transactional
    public long insertNewCompany(UserDataDTO userDataDTO) {
        if (userDao.findByLogin(userDataDTO.getUser().getLogin()) != null) {
            throw new RuntimeException("usuario ya existe");
        }
        if (userDao.findByEmail(userDataDTO.getUser().getEmail()) != null) {
            throw new RuntimeException("email ya existe");
        }
        if (companyDao.findByCif(userDataDTO.getCompany().getCif()) != null) {
            throw new RuntimeException("cif ya existe");
        }
        User user = UserMapper.INSTANCE.toEntity(userDataDTO.getUser());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Role companyRole = roleDao.findById(COMPANY_ROLE)
                .orElseThrow(() -> new RuntimeException("Role not found: " + COMPANY_ROLE));
        user.setRole(companyRole);
        userDao.saveAndFlush(user);
        Company company = CompanyMapper.INSTANCE.toEntity(userDataDTO.getCompany());
        company.setUser(user);
        companyDao.saveAndFlush(company);


        return company.getId();
    }
    @Transactional(readOnly = true)
    public long countJobOffersByCompany(long companyId) {
        Company company = companyDao.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + companyId));
        return jobOffersDao.countByCompany(company);
    }

    @Transactional
    public void deleteCompany(long companyId) {
        Company company = companyDao.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + companyId));

        User user = company.getUser();

        companyDao.delete(company);

        if (user != null) {
            userDao.delete(user);
        }
    }

    @Transactional
    public Company updateCompany(CompanyDTO companyDTO) {

      if (companyDTO.getId()<=0){
          throw new IllegalArgumentException("Invalid company id: " + companyDTO.getId());
      }
      Company existingCompany = companyDao.findById(companyDTO.getId())
              .orElseThrow(() -> new RuntimeException("Company not found with id: " + companyDTO.getId()));

      if(companyDTO.getName()!= null){
           existingCompany.setName(companyDTO.getName());
     }
      if(companyDTO.getUser() != null && companyDTO.getUser().getLogin()!=null){
           existingCompany.getUser().setLogin(companyDTO.getUser().getLogin());
       }
      if(companyDTO.getCif()!=null){
          existingCompany.setCif(companyDTO.getCif());
        }
      if(companyDTO.getPhone()!=null){
          existingCompany.setPhone(companyDTO.getPhone());
        }
      if(companyDTO.getAddress()!=null){
          existingCompany.setAddress(companyDTO.getAddress());
        }
      if(companyDTO.getWeb()!=null){
           existingCompany.setWeb(companyDTO.getWeb());
         }
      if(companyDTO.getUser() != null && companyDTO.getUser().getEmail()!=null){
           existingCompany.getUser().setEmail(companyDTO.getUser().getEmail());
         }

      companyDao.save(existingCompany);
      return existingCompany;
    }

}