package com.university.service.student;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.university.config.SecurityUtils;
import com.university.dto.request.student.DangKyTinChiRequestDTO;
import com.university.dto.response.student.DangKyTinChiResponseDTO;
import com.university.entity.DangKyTinChi;
import com.university.entity.HocVien;
import com.university.entity.LopHocPhan;
import com.university.enums.TrangThaiLHP;
import com.university.repository.student.DangKyTinChiRepository;
import com.university.repository.student.HocVienStudentsRepository;
import com.university.repository.student.LopHocPhanStudentsRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DangKyTinChiService {

    private final DangKyTinChiRepository dangKyTinChiRepository;
    private final HocVienStudentsRepository hocVienStudentsRepository;
    private final LopHocPhanStudentsRepository lopHocPhanStudentsRepository;

    public synchronized DangKyTinChiResponseDTO dangKy(DangKyTinChiRequestDTO request) {
        UUID hocVienId = SecurityUtils.getCurrentHocVienId();
        UUID lopHocPhanId = Objects.requireNonNull(request.getLopHocPhanId(), "LopHocPhanId khong duoc null");

        if (dangKyTinChiRepository.existsByHocVienIdAndLopHocPhanId(hocVienId, lopHocPhanId)) {
            throw new RuntimeException("Hoc vien da dang ky lop hoc phan nay");
        }

        HocVien hocVien = hocVienStudentsRepository.findById(hocVienId)
                .orElseThrow(() -> new RuntimeException("Hoc vien khong ton tai"));

        LopHocPhan lopHocPhan = lopHocPhanStudentsRepository.findById(lopHocPhanId)
                .orElseThrow(() -> new RuntimeException("Lop hoc phan khong ton tai"));

        if (lopHocPhan.getTrangThai() != TrangThaiLHP.MO_DANG_KY) {
            throw new RuntimeException("Lop hoc phan khong mo dang ky");
        }

        if (lopHocPhan.getHanDangKy() != null
                && LocalDateTime.now().isAfter(lopHocPhan.getHanDangKy())) {
            throw new RuntimeException("Da het han dang ky");
        }

        boolean trungLich = dangKyTinChiRepository.existsTrungLichFull(hocVienId, lopHocPhanId);
        if (trungLich) {
            throw new RuntimeException("Trung lich hoc");
        }

        if (dangKyTinChiRepository.daHocMon(hocVienId, lopHocPhan.getMonHoc().getId())) {
            throw new RuntimeException("Ban da hoc mon nay roi");
        }

        if (!dangKyTinChiRepository.daHocMonTienQuyet(hocVienId, lopHocPhan.getMonHoc().getId())) {
            throw new RuntimeException("Chua hoc mon tien quyet");
        }

        Integer tongTinChiDangKy = dangKyTinChiRepository.sumTinChiByHocVien(hocVienId);
        int tongTinChi = tongTinChiDangKy == null ? 0 : tongTinChiDangKy;
        int tinChiMoi = lopHocPhan.getMonHoc().getSoTinChi();

        if (tongTinChi + tinChiMoi > 25) {
            throw new RuntimeException("Vuot qua so tin chi toi da");
        }

        int soLuong = dangKyTinChiRepository.countByLopHocPhanId(lopHocPhanId);
        if (soLuong >= lopHocPhan.getSoLuongToiDa()) {
            throw new RuntimeException("Lop hoc phan da day");
        }

        DangKyTinChi dangKy = new DangKyTinChi();
        dangKy.setHocVien(hocVien);
        dangKy.setLopHocPhan(lopHocPhan);

        dangKyTinChiRepository.save(dangKy);

        return dangKyTinChiRepository
                .findDangKyTinChiResponseDTOById(dangKy.getId())
                .orElseThrow(() -> new RuntimeException("Khong tim thay ket qua"));
    }

    public void huyDangKyTinChi(UUID id) {
        UUID hocVienId = SecurityUtils.getCurrentHocVienId();

        DangKyTinChi dangKyTinChi = dangKyTinChiRepository
                .findById(Objects.requireNonNull(id, "Id khong duoc null"))
                .orElseThrow(() -> new RuntimeException("Dang ky tin chi khong ton tai"));

        if (!dangKyTinChi.getHocVien().getId().equals(hocVienId)) {
            throw new RuntimeException("Khong duoc huy dang ky cua hoc vien khac");
        }

        LopHocPhan lopHocPhan = dangKyTinChi.getLopHocPhan();

        if (lopHocPhan.getHanHuy() != null
                && LocalDateTime.now().isAfter(lopHocPhan.getHanHuy())) {
            throw new RuntimeException("Da qua han huy dang ky");
        }

        dangKyTinChiRepository.delete(dangKyTinChi);
    }

    public List<DangKyTinChiResponseDTO> getDangKyTinChiCuaToi() {
        UUID hocVienId = SecurityUtils.getCurrentHocVienId();
        return dangKyTinChiRepository.findDangKyTinChiResponseDTOByHocVienId(hocVienId);
    }
}
