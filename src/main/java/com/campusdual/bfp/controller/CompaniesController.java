package com.campusdual.bfp.controller;

import com.campusdual.bfp.api.ICompaniesService;
import com.campusdual.bfp.model.dto.CompaniesDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController()
@RequestMapping("/companies")
public class CompaniesController {

    @Autowired
    private ICompaniesService companiesService;

    @GetMapping
    public String testController(){
        return "Companies controller works!";
    }

    @PostMapping
    public String testController(@RequestBody String name){
        return "Companies controller works, " + name + "!";
    }

    @GetMapping(value = "/testMethod")
    public String testControllerMethod(){
        return "Companies controller method works";
    }

    @PostMapping(value = "/get")
    public CompaniesDTO queryCompanies(@RequestBody CompaniesDTO companiesDTO){
        return companiesService.queryCompanies(companiesDTO);
    }

    @GetMapping(value = "/getAll")
    public List<CompaniesDTO> queryAllCompanies() {
        return companiesService.queryAllCompanies();
    }

    @PostMapping(value = "/add")
    public int addCompanies(@RequestBody CompaniesDTO companiesDTO){
        return companiesService.insertCompanies(companiesDTO);
    }

    @PutMapping(value = "/update")
    public int updateCompanies(@RequestBody CompaniesDTO companiesDTO){
        return companiesService.updateCompanies(companiesDTO);
    }

    @DeleteMapping(value = "/delete")
    public int deleteCompanies(@RequestBody CompaniesDTO companiesDTO){
        return companiesService.deleteCompanies(companiesDTO);
    }

}
