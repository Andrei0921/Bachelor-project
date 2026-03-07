package com.example.mapper;

import com.example.domain.User;
import com.example.dto.UserDTO;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    /**
     * Converts a User entity to a UserDto.
     *
     * @param user the User entity to convert
     * @return the corresponding UserDto
     */
    public static UserDTO toDto(User user) {
        return new UserDTO(
                user.getId(), user.getName(), user.getEmail(), user.getPassword(), user.getRole(), user.getCreatedAt());
    }

    /**
     * Converts a UserDto to a User entity.
     *
     * @param dto the UserDto to convert
     * @return the corresponding User entity
     */
    public static User fromDto(UserDTO dto) {
        return new User(dto.getId(), dto.getName(), dto.getEmail(), dto.getPassword(), dto.getRole());
    }

    public static Collection<UserDTO> toDtoList(Collection<User> users) {
        List<UserDTO> userDTOS = new ArrayList<>();

        for (User user : users) {
            userDTOS.add(toDto(user));
        }

        return userDTOS;
    }
}
