package com.university.service.admin;

import com.university.dto.request.admin.UserRoleAdminRequestDTO;
import com.university.dto.response.admin.UsersRoleAdminResponseDTO;
import com.university.entity.Role;
import com.university.entity.UserRole;
import com.university.entity.Users;
import com.university.mapper.admin.UserRoleAdminMapper;
import com.university.repository.admin.RoleAdminRepository;
import com.university.repository.admin.UserRoleAdminRepository;
import com.university.repository.admin.UsersAdminRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserRoleAdminService {

    private final UsersAdminRepository usersAdminRepository;
    private final RoleAdminRepository roleRepository;
    private final UserRoleAdminMapper userRoleAdminMapper;
    private final UserRoleAdminRepository userRoleAdminRepository;

    @Transactional
    public List<UsersRoleAdminResponseDTO> createListUserRole(List<UserRoleAdminRequestDTO> requests) {

        List<UserRole> list = requests.stream().map(req -> {

            Users users = usersAdminRepository.findById(req.getUsersId()).orElseThrow();
            Role role = roleRepository.findById(req.getUsersId()).orElseThrow();

            if (usersAdminRepository.existsById(req.getUsersId())) {
                throw new EntityNotFoundException("Users or học không tồn tại");
            }

            if (users == null || role == null) {
                throw new EntityNotFoundException("Users or role không tồn tại");
            }
            UserRole userRole = userRoleAdminMapper.toEntity(role, users);

            return userRole;

        }).toList();

        List<UserRole> savedList = userRoleAdminRepository.saveAll(list);

        return savedList.stream()
                .map(userRoleAdminMapper::toResponseDTO)
                .toList();
    }

    public void delete(UUID id) {
        UserRole userRole = userRoleAdminRepository.findById(id).orElseThrow(() -> new EntityNotFoundException());
        userRoleAdminRepository.delete(userRole);
    }

}