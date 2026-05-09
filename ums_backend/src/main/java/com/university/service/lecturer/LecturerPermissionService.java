package com.university.service.lecturer;

import com.university.entity.Users;
import com.university.repository.admin.UserRoleAdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LecturerPermissionService {

    private final UserRoleAdminRepository userRoleRepository;

    public boolean hasPermission(UUID userId, String permission) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof Users user) {
            if (!user.getId().equals(userId)) {
                return false;
            }
        }

        Set<String> userPermissions = getUserPermissions(userId);
        return userPermissions.contains(permission);
    }

    public Set<String> getUserPermissions(UUID userId) {
        List<String> rolePermissions = userRoleRepository.findPermissionsByUserId(userId);
        return new HashSet<>(rolePermissions);
    }

    public boolean isOwnerOrAdmin(UUID userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof Users user) {
            if (user.getId().equals(userId)) {
                return true;
            }
        }

        return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}
