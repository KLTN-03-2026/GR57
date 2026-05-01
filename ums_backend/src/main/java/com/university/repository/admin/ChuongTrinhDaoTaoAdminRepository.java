package com.university.repository.admin;

import com.university.dto.response.admin.ChuongTrinhDaoTaoAdminResponseDTO.ChuongTrinhDaoTaoView;
import com.university.entity.ChuongTrinhDaoTao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChuongTrinhDaoTaoAdminRepository extends JpaRepository<ChuongTrinhDaoTao, UUID> {
    List<ChuongTrinhDaoTaoView> findAllProjectedBy();

    List<ChuongTrinhDaoTaoView> findAllProjectedByNganh_Id(UUID nganhId);
}
