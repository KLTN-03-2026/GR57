package com.university.controller.admin;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.university.dto.request.admin.UserRoleAdminRequestDTO;
import com.university.dto.response.admin.UsersRoleAdminResponseDTO;
import com.university.service.admin.UserRoleAdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/user-role")
public class UserRoleAdminController {

    private final UserRoleAdminService userRoleAdminService;

    public UserRoleAdminController(UserRoleAdminService userRoleAdminService) {
        this.userRoleAdminService = userRoleAdminService;
    }

    @PostMapping
    public ResponseEntity<List<UsersRoleAdminResponseDTO>> create(
            @Valid @RequestBody List<UserRoleAdminRequestDTO> dto) {
        return ResponseEntity.ok(userRoleAdminService.createListUserRole(dto));
    }

    @DeleteMapping
    public ResponseEntity<Void> delete(@Valid @PathVariable UUID id) {
        userRoleAdminService.delete(id);
        return ResponseEntity.noContent().build();
    }
}