package com.campusdual.bfp.model.dto.dtomapper;

import com.campusdual.bfp.model.User;
import com.campusdual.bfp.model.dto.UserDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    default UserDTO toDTO(User user) {
        if (user == null) return null;
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setLogin(user.getLogin());
        Long roleId = null;
        if (user.getRole() != null) {
            dto.setRole_id(user.getRole().getId());
        } else {
            dto.setRole_id(0L);
        }
        dto.setRole_id(roleId != null ? roleId : 0L);
        return dto;
    }

    User toEntity(UserDTO userDTO);
}

