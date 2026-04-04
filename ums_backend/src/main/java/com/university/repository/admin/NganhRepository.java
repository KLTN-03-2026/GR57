package com.university.repository.admin;

import com.university.entity.Nganh;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NganhRepository extends JpaRepository<Nganh, UUID> {

        @Query("SELECT n FROM Nganh n WHERE LOWER(n.tenNganh) LIKE LOWER(CONCAT('%',:keyword, '%'))")
        List<Nganh> searchByTenNganh(@Param("keyword") String keyword);

        Optional<Nganh> findByMaNganh(String maNganh);
}
