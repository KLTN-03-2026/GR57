package com.university.repository.admin;

import com.university.entity.HocKi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface HocKiAdminRepository extends JpaRepository<HocKi, UUID> {

}
