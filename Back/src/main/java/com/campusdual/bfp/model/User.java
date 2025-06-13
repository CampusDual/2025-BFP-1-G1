package com.campusdual.bfp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private long id;

    @Column(name="cif")
    private String cif;

    @Column
    private String name;

    @Column
    private String telephone;

    @Column
    private String email;

    @Column
    private String address;

    @Column
    private String login;

    @JsonIgnore
    @Column
    private String password;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private Set<UserRole> userRoles = new HashSet<>();

    public User(){ }
    public User(int id, String cif, String name, String telephone, String email,String address, String login, String password) {
        this.id = id;
        this.cif = cif;
        this.name = name;
        this.telephone = telephone;
        this.email = email;
        this.address = address;
        this.login = login;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCif() {
        return cif;
    }

    public void setCif(String cif) {
        this.cif = cif;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress(){return this.address;}

    public void setAddress(String address){
        this.address = address;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }



    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();
        if (userRoles != null) {
            for (UserRole userRole : userRoles) {
                if (userRole.getRole() != null) {
                    authorities.add(new SimpleGrantedAuthority(userRole.getRole().getRoleName()));
                }
            }
        }
        return authorities;
    }

    @Override
    public String getUsername() {
        return this.login;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
    @Override
    public String getPassword() {
        return password;
    }
}
