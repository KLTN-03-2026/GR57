// package com.university.repository.admin;

// import com.university.dto.response.admin.TruongResponseDTO;
// import com.university.entity.Truong;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
// import org.springframework.stereotype.Repository;

// import java.util.List;
// import java.util.Optional;
// import java.util.UUID;

// @Repository
// public interface TruongRepository extends JpaRepository<Truong, UUID> {

//     @Query("""
//              SELECT new com.university.dto.response.admin.TruongResponseDTO(
//                  t.id,
//                  t.maTruong,
//                  t.tenTruong,
//                  t.diaChi,
//                  t.moTa,
//                  t.ngayThanhLap,
//                  t.nguoiDaiDien
//              )
//              FROM Truong t
//             """)
//     List<TruongResponseDTO> FindAllDTO();

//     @Query("""
//              SELECT new com.university.dto.response.admin.TruongResponseDTO(
//                  t.id,
//                  t.maTruong,
//                  t.tenTruong,
//                  t.diaChi,
//                  t.moTa,
//                  t.ngayThanhLap,
//                  t.nguoiDaiDien
//              )
//              FROM Truong t
//              WHERE t.id = :truongId
//             """)
//     TruongResponseDTO FindTruongById(@Param("truongId") UUID truongId);

//     Optional<Truong> findByMaTruong(String maTruong);

//     boolean existsByMaTruong(String maTruong);
// }
