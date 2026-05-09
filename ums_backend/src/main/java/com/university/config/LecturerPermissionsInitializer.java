package com.university.config;

import com.university.entity.Permissions;
import com.university.entity.Role;
import com.university.entity.RolePermissions;
import com.university.enums.LecturerPermission;
import com.university.repository.admin.PermissionsAdminRepository;
import com.university.repository.admin.RoleAdminRepository;
import com.university.repository.admin.RolePermissionsAdminRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

/**
 * Initializer để tạo permissions mặc định cho Lecturer khi ứng dụng khởi động
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class LecturerPermissionsInitializer {

    private final PermissionsAdminRepository permissionsRepository;
    private final RoleAdminRepository roleRepository;
    private final RolePermissionsAdminRepository rolePermissionsRepository;

    private static final String LECTURER_ROLE = "LECTURER";

    @Bean
    public ApplicationRunner lecturerPermissionsRunner() {
        return args -> {
            log.info("=== Initializing Lecturer Permissions ===");

            // 1. Tạo tất cả permissions LECTURER_* nếu chưa có
            Arrays.stream(LecturerPermission.values()).forEach(permission -> {
                if (!permissionsRepository.existsByMaPermissions(permission.name())) {
                    Permissions entity = new Permissions();
                    entity.setMaPermissions(permission.name());
                    entity.setMoTa(permission.getMoTa());
                    permissionsRepository.save(entity);
                    log.info("Created permission: {} - {}", permission.name(), permission.getMoTa());
                }
            });

            // 2. Tìm hoặc tạo role LECTURER
            Role lecturerRole = roleRepository.findAll().stream()
                    .filter(r -> LECTURER_ROLE.equalsIgnoreCase(r.getMaRole()))
                    .findFirst()
                    .orElseGet(() -> {
                        Role newRole = new Role();
                        newRole.setMaRole(LECTURER_ROLE);
                        newRole.setMoTa("Giảng viên");
                        log.info("Created role: {}", LECTURER_ROLE);
                        return roleRepository.save(newRole);
                    });

            // 3. Gán tất cả LECTURER permissions vào role LECTURER nếu chưa có
            Arrays.stream(LecturerPermission.values()).forEach(permission -> {
                permissionsRepository.findAll().stream()
                        .filter(p -> p.getMaPermissions().equals(permission.name()))
                        .findFirst()
                        .ifPresent(perm -> {
                            if (!rolePermissionsRepository.existsByRoleIdAndPermissionsId(
                                    lecturerRole.getId(), perm.getId())) {
                                RolePermissions rp = new RolePermissions();
                                rp.setRole(lecturerRole);
                                rp.setPermissions(perm);
                                rolePermissionsRepository.save(rp);
                                log.info("Assigned permission {} to role {}", permission.name(), LECTURER_ROLE);
                            }
                        });
            });

            log.info("=== Lecturer Permissions Initialization Complete ===");
        };
    }
}