// package com.university.service.student;

// import java.util.List;
// import java.util.UUID;

// import org.springframework.stereotype.Service;

// import com.university.dto.request.student.DangKyTinChiRequestDTO;
// import com.university.dto.request.student.HuyTinChiRequestDTO;
// import com.university.dto.response.student.DangKyTinChiResponseDTO;
// import com.university.entity.DangKyTinChi;
// import com.university.entity.HocVien;
// import com.university.entity.LopHocPhan;
// import com.university.enums.TrangThaiLHP;
// import com.university.repository.student.DangKyTinChiRepository;
// import com.university.repository.student.HocVienRepository;
// import com.university.repository.student.LopHocPhanRepository;

// import jakarta.transaction.Transactional;
// import lombok.RequiredArgsConstructor;



// @Service
// @RequiredArgsConstructor
// @Transactional
// public class DangKyTinChiService {
//     private final DangKyTinChiRepository dangKyTinChiRepository;
//     private final HocVienRepository hocVienRepository;
//     private final LopHocPhanRepository lopHocPhanRepository;

//     public DangKyTinChiRepository DangKy(DangKyTinChiRequestDTO request) {
//         if (DangKyTinChiRepository.existsByHocVienIdAndLopHocPhanId(request.getHocVienId(), request.getLopHocPhanId())) {
//             throw new RuntimeException("Học viên đã đăng ký lớp học phần này");
//         }
//         HocVien hocVien = hocVienRepository.findById(request.getHocVienId())
//                 .orElseThrow(() -> new RuntimeException("Học viên không tồn tại"));
        
//         LopHocPhan lopHocPhan = lopHocPhanRepository.findById(request.getLopHocPhanId())
//                 .orElseThrow(() -> new RuntimeException("Lớp học phần không tồn tại"));
//         if (LopHocPhan.getTrangThai() !=TrangThaiLHP.MO) {
//             throw new RuntimeException("Lớp học phần đã đóng đăng ký");
//         }
//         if (lopHocPhan.getHocVienDangKy().size() >= lopHocPhan.getSoLuongMax()) {
//             throw new RuntimeException("Lớp học phần đã đầy");
//         }

//         DangKyTinChi dangKyTinChi = new DangKyTinChi();
//         dangKyTinChi.setHocVien(hocVien);
//         dangKyTinChi.setLopHocPhan(lopHocPhan);
//         dangKyTinChiRepository.save(dangKyTinChi);

//         return dangKyTinChiRepository.findDangKyTinChiResponseDTOById(dangKyTinChi.getId());    
//             .orElseThrow(() -> new RuntimeException("Đăng ký tín chỉ không tồn tại"));
//     }
//     public void HuyDangKyTinChi(HuyTinChiRequestDTO request) {
//         DangKyTinChi dangKyTinChi = dangKyTinChiRepository.findByHocVienIdAndLopHocPhanId(request.getHocVienId(), request.getLopHocPhanId())
//                 .orElseThrow(() -> new RuntimeException("Đăng ký tín chỉ không tồn tại"));
//         dangKyTinChiRepository.delete(dangKyTinChi);
//     }

//     public List<DangKyTinChiResponseDTO> getDangKyTinChiByHocVienId(UUID hocVienId) {
//         return dangKyTinChiRepository.findDangKyTinChiResponseDTOByHocVienId(hocVienId);
//     }
// }
