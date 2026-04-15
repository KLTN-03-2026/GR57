package com.university.repository.student;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.university.entity.HocVien;

@Repository
public interface HocVienStudentsRepository extends JpaRepository<HocVien, UUID> {
    
}
