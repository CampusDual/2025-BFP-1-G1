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
        System.out.println("=== INICIO insertNewCompany ===");
        System.out.println("UserDataDTO recibido: " + (userDataDTO != null ? "No nulo" : "NULO"));
        
        try {
            // Log detallado del objeto recibido
            if (userDataDTO != null) {
                System.out.println("User: " + (userDataDTO.getUser() != null ? "No nulo" : "NULO"));
                if (userDataDTO.getUser() != null) {
                    System.out.println("  - Login: " + userDataDTO.getUser().getLogin());
                    System.out.println("  - Email: " + userDataDTO.getUser().getEmail());
                }
                System.out.println("Company: " + (userDataDTO.getCompany() != null ? "No nulo" : "NULO"));
                if (userDataDTO.getCompany() != null) {
                    System.out.println("  - CIF: " + userDataDTO.getCompany().getCif());
                    System.out.println("  - Nombre: " + userDataDTO.getCompany().getName());
                }
            }
            // Validar datos de entrada
            if (userDataDTO == null) {
                throw new RuntimeException("UserDataDTO no puede ser nulo");
            }
            if (userDataDTO.getUser() == null) {
                throw new RuntimeException("UserDTO no puede ser nulo");
            }
            if (userDataDTO.getCompany() == null) {
                throw new RuntimeException("CompanyDTO no puede ser nulo");
            }
            
            // Validar usuario existente
            String login = userDataDTO.getUser().getLogin();
            System.out.println("Validando usuario: " + login);
            if (userDao.findByLogin(login) != null) {
                System.err.println("Error: El usuario ya existe: " + login);
                throw new RuntimeException("usuario ya existe");
            }
            
            // Validar email existente
            String email = userDataDTO.getUser().getEmail();
            System.out.println("Validando email: " + email);
            if (userDao.findByEmail(email) != null) {
                System.err.println("Error: El email ya existe: " + email);
                throw new RuntimeException("email ya existe");
            }
            
            // Validar CIF existente
            String cif = userDataDTO.getCompany().getCif();
            System.out.println("Validando CIF: " + cif);
            if (companyDao.findByCif(cif) != null) {
                System.err.println("Error: El CIF ya existe: " + cif);
                throw new RuntimeException("cif ya existe");
            }
            
            // Crear y guardar usuario
            System.out.println("Creando usuario...");
            User user;
            try {
                // Verificar y mostrar los datos del usuario
                System.out.println("Datos del usuario recibidos:");
                System.out.println("Login: " + userDataDTO.getUser().getLogin());
                System.out.println("Email: " + userDataDTO.getUser().getEmail());
                
                // Mapear el usuario
                user = UserMapper.INSTANCE.toEntity(userDataDTO.getUser());
                if (user == null) {
                    throw new RuntimeException("Error al mapear UserDTO a entidad User - El objeto User resultante es nulo");
                }
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                
                System.out.println("Buscando rol de compañía (ID: " + COMPANY_ROLE + ")");
                Role companyRole = roleDao.findById(COMPANY_ROLE)
                        .orElseThrow(() -> {
                            String errorMsg = "Role no encontrado: " + COMPANY_ROLE;
                            System.err.println(errorMsg);
                            return new RuntimeException(errorMsg);
                        });
                
                user.setRole(companyRole);
                System.out.println("Guardando usuario en la base de datos...");
                user = userDao.saveAndFlush(user);
                System.out.println("Usuario guardado con ID: " + user.getId());
                
                // Crear y guardar compañía
                System.out.println("\n=== Creando compañía ===");
                System.out.println("Datos de la compañía recibidos:");
                System.out.println("CIF: " + userDataDTO.getCompany().getCif());
                System.out.println("Nombre: " + userDataDTO.getCompany().getName());
                System.out.println("Teléfono: " + userDataDTO.getCompany().getPhone());
                System.out.println("Dirección: " + userDataDTO.getCompany().getAddress());
                System.out.println("Web: " + userDataDTO.getCompany().getWeb());
                
                    // Crear una nueva instancia de Company manualmente para evitar problemas con el mapeo
                    CompanyDTO companyDTO = userDataDTO.getCompany();
                    if (companyDTO == null) {
                        throw new RuntimeException("Los datos de la compañía no pueden ser nulos");
                    }
                    
                    Company company = new Company();
                    company.setCif(companyDTO.getCif());
                    company.setName(companyDTO.getName());
                    company.setPhone(companyDTO.getPhone());
                    company.setAddress(companyDTO.getAddress());
                    company.setWeb(companyDTO.getWeb());
                    // El ID se generará automáticamente al guardar en la base de datos
                    
                    company.setUser(user);
                    
                    System.out.println("Guardando compañía en la base de datos...");
                    company = companyDao.saveAndFlush(company);
                    System.out.println("Compañía guardada con ID: " + company.getId());
                    
                    System.out.println("=== FIN insertNewCompany (éxito) ===");
                    return company.getId();
                    
                } catch (Exception e) {
                    System.err.println("Error durante la creación de la compañía: " + e.getMessage());
                    e.printStackTrace();
                    throw new RuntimeException("Error al crear la compañía: " + (e.getMessage() != null ? e.getMessage() : "Error desconocido"), e);
                }
        } catch (Exception e) {
            System.err.println("Error en insertNewCompany: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
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