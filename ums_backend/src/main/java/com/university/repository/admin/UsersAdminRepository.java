package com.university.repository.admin;

import com.university.entity.Users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsersAdminRepository extends JpaRepository<Users, UUID> {

    Users findByEmail(String keyword);

    boolean existsByUserName(String usersname);

    // @Query("SELECT u.userName FROM Users u")
    // List<String> findAllUserNames();

    // @Query("SELECT u FROM Users u WHERE u.userName = :userName")
    // Optional<Users> findByUserName(@Param("userName") String userName);

}
