package com.university.config;

import com.university.entity.Permissions;
import com.university.enums.LecturerPermission;
import com.university.repository.admin.PermissionsAdminRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

/**
 * Initializer để tạo permissions mặc định cho Lecturer khi ứng dụng khởi động
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class LecturerPermissionsInitializer {

    private final PermissionsAdminRepository permissionsRepository;

    @Bean
    public ApplicationRunner lecturerPermissionsInitializer() {
        return args -> {
            log.info("=== Initializing Lecturer Permissions ===");

            List<Permissions> savedPermissions = permissionsRepository.findAll();
            boolean hasLecturerPermissions = savedPermissions.stream()
                    .anyMatch(p -> p.getMaPermissions().startsWith("LECTURER_"));

            if (hasLecturerPermissions) {
                log.info("Lecturer permissions already exist, skipping...");
                return;
            }

            Arrays.stream(LecturerPermission.values()).forEach(permission -> {
                if (!permissionsRepository.existsByMaPermissions(permission.name())) {
                    Permissions entity = new Permissions();
                    entity.setMaPermissions(permission.name());
                    entity.setMoTa(permission.getMoTa());
                    permissionsRepository.save(entity);
                    log.info("Created permission: {} - {}", permission.name(), permission.getMoTa());
                }
            });

            log.info("=== Lecturer Permissions Initialization Complete ===");
        };
    }
}