package com.university.repository.admin;

import com.university.entity.UserRole;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserRoleAdminRepository extends JpaRepository<UserRole, UUID> {
        boolean existsByRoleId(UUID roleId);

        boolean existsByUsersId(UUID usersId);

        @Query("SELECT p.maPermissions FROM UserRole ur " +
               "JOIN ur.role r " +
               "JOIN r.permissions p " +
               "WHERE ur.users.id = :userId")
        List<String> findPermissionsByUserId(@Param("userId") UUID userId);
}
