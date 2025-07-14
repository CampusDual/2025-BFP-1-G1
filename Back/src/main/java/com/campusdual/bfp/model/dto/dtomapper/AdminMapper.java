package com.campusdual.bfp.model.dto.dtomapper;

import com.campusdual.bfp.model.Admin;
import com.campusdual.bfp.model.dto.AdminDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;


@Mapper(uses = {UserMapper.class})
public interface AdminMapper {
    AdminMapper INSTANCE = Mappers.getMapper(AdminMapper.class);
    AdminDTO toDTO(Admin admin);
    Admin toEntity(AdminDTO adminDTO);
}
