package com.university.service.admin;

import com.university.dto.request.admin.UserRoleAdminRequestDTO;
import com.university.dto.response.admin.UsersRoleAdminResponseDTO;
import com.university.entity.Role;
import com.university.entity.UserRole;
import com.university.entity.Users;
import com.university.exception.SimpleMessageException;
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

    public List<UsersRoleAdminResponseDTO> getAll() {
        return userRoleAdminRepository.getAllDTO();
    }

    public UsersRoleAdminResponseDTO getById(UUID id) {
        UserRole userRole = userRoleAdminRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy UserRole"));
        return userRoleAdminMapper.toResponseDTO(userRole, userRole.getUsers(), userRole.getRole());
    }

    public UsersRoleAdminResponseDTO getByUserId(UUID usersId) {
        UserRole us = userRoleAdminRepository.findByUsersId(usersId);
        Users users = us.getUsers();
        Role role = us.getRole();
        return userRoleAdminMapper.toResponseDTO(us, users, role);
    }

    public UsersRoleAdminResponseDTO getByRoleId(UUID roleId) {
        UserRole us = userRoleAdminRepository.findByRoleId(roleId);
        return userRoleAdminMapper.toResponseDTO(us, us.getUsers(),
                us.getRole());
    }

    public UsersRoleAdminResponseDTO create(UserRoleAdminRequestDTO request) {
        Users users = usersAdminRepository.findById(request.getUsersId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tài khoản"));
        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy vai trò"));

        UserRole userRole = userRoleAdminMapper.toEntity(role, users);
        return userRoleAdminMapper.toResponseDTO(userRoleAdminRepository.save(userRole), userRole.getUsers(),
                userRole.getRole());
    }

    @Transactional
    public List<UsersRoleAdminResponseDTO> createListUserRole(List<UserRoleAdminRequestDTO> requests) {
        List<UserRole> list = requests.stream().map(req -> {
            Users users = usersAdminRepository.findById(req.getUsersId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tài khoản"));
            Role role = roleRepository.findById(req.getRoleId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy vai trò"));

            return userRoleAdminMapper.toEntity(role, users);
        }).toList();

        List<UserRole> savedList = userRoleAdminRepository.saveAll(list);

        return savedList.stream()
                .map(m -> {
                    UsersRoleAdminResponseDTO us = userRoleAdminMapper.toResponseDTO(m, m.getUsers(), m.getRole());
                    return us;
                }).toList();
    }

    /**
     * Xóa user-role theo ID
     */
    public void delete(UUID id) {
        UserRole userRole = userRoleAdminRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy UserRole"));
        userRoleAdminRepository.delete(userRole);
    }

    /**
     * Xóa nhiều user-role
     */
    @Transactional
    public void deleteAll(List<UUID> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }
        try {
            userRoleAdminRepository.deleteAllByIdInBatch(ids);
        } catch (Exception e) {
            throw new SimpleMessageException("Lỗi khi xóa danh sách: " + e.getMessage());
        }
    }
}