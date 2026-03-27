package com.university.repository.admin;

import com.university.entity.Khoa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface KhoaRepository extends JpaRepository<Khoa, UUID> {
    List<Khoa> findByMaKhoaContainingIgnoreCaseOrTenKhoaContainingIgnoreCase(String ma, String ten);
}