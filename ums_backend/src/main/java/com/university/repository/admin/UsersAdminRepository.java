package com.university.repository.admin;

import com.university.entity.Users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UsersAdminRepository extends JpaRepository<Users, UUID> {

    Users findByEmail(String keyword);

}
