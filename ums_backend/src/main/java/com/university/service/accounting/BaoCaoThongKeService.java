package com.university.service.accounting;

import com.university.dto.response.accounting.BaoCaoThongKeOverviewResponse;
import com.university.dto.response.accounting.PaymentInfoResponse;
import com.university.entity.HocPhi;
import com.university.entity.ThanhToanHocPhi;
import com.university.enums.HocPhiEnum;
import com.university.repository.admin.HocPhiAdminRepository;
import com.university.repository.admin.ThanhToanHocPhiAdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BaoCaoThongKeService {

    private final HocPhiAdminRepository hocPhiAdminRepository;
    private final ThanhToanHocPhiAdminRepository thanhToanHocPhiAdminRepository;

    @Transactional(readOnly = true)
    public BaoCaoThongKeOverviewResponse getOverview(LocalDate start, LocalDate end) {
        LocalDateTime startDt = start == null ? null : start.atStartOfDay();
        LocalDateTime endDt = end == null ? null : end.atTime(23, 59, 59);

        List<ThanhToanHocPhi> payments = thanhToanHocPhiAdminRepository.findAll().stream()
                .filter(p -> inRange(p.getNgayThanhToan(), startDt, endDt))
                .collect(Collectors.toList());

        double tongDoanhThu = payments.stream()
                .mapToDouble(p -> Optional.ofNullable(p.getHocPhi()).map(HocPhi::getSoTien).orElse(0.0))
                .sum();

        long soLuongThanhToan = payments.size();

        Map<YearMonth, Double> monthly = payments.stream()
                .filter(p -> p.getNgayThanhToan() != null)
                .collect(Collectors.groupingBy(p -> YearMonth.from(p.getNgayThanhToan()),
                        Collectors.summingDouble(
                                p -> Optional.ofNullable(p.getHocPhi()).map(HocPhi::getSoTien).orElse(0.0))));

        List<BaoCaoThongKeOverviewResponse.MonthlyRevenue> doanhThuTheoThang = monthly.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> new BaoCaoThongKeOverviewResponse.MonthlyRevenue(e.getKey().toString(), e.getValue()))
                .collect(Collectors.toList());

        List<HocPhi> hocPhis = hocPhiAdminRepository.findAll().stream()
                .filter(hp -> inRange(hp.getCreatedAt(), startDt, endDt))
                .collect(Collectors.toList());

        double tongCanThanhToan = hocPhis.stream()
                .filter(hp -> hp.getTrangThai() != HocPhiEnum.DA_THANH_TOAN)
                .mapToDouble(hp -> Optional.ofNullable(hp.getSoTien()).orElse(0.0))
                .sum();

        double tongDaThanhToan = hocPhis.stream()
                .filter(hp -> hp.getTrangThai() == HocPhiEnum.DA_THANH_TOAN)
                .mapToDouble(hp -> Optional.ofNullable(hp.getSoTien()).orElse(0.0))
                .sum();

        double tongQuaHan = hocPhis.stream()
                .filter(hp -> hp.getTrangThai() == HocPhiEnum.QUA_HAN)
                .mapToDouble(hp -> Optional.ofNullable(hp.getSoTien()).orElse(0.0))
                .sum();

        List<PaymentInfoResponse> recent = payments.stream()
                .sorted(Comparator.comparing(ThanhToanHocPhi::getNgayThanhToan).reversed())
                .limit(10)
                .map(this::toPaymentInfo)
                .collect(Collectors.toList());

        return BaoCaoThongKeOverviewResponse.builder()
                .tongDoanhThu(tongDoanhThu)
                .soLuongThanhToan(soLuongThanhToan)
                .tongCanThanhToan(tongCanThanhToan)
                .tongDaThanhToan(tongDaThanhToan)
                .tongQuaHan(tongQuaHan)
                .doanhThuTheoThang(doanhThuTheoThang)
                .danhSachThanhToanMoiNhat(recent)
                .build();
    }

    @Transactional(readOnly = true)
    public List<PaymentInfoResponse> getPayments(LocalDate start, LocalDate end) {
        LocalDateTime startDt = start == null ? null : start.atStartOfDay();
        LocalDateTime endDt = end == null ? null : end.atTime(23, 59, 59);

        return thanhToanHocPhiAdminRepository.findAll().stream()
                .filter(p -> inRange(p.getNgayThanhToan(), startDt, endDt))
                .sorted(Comparator.comparing(ThanhToanHocPhi::getNgayThanhToan).reversed())
                .map(this::toPaymentInfo)
                .collect(Collectors.toList());
    }

    private boolean inRange(LocalDateTime value, LocalDateTime start, LocalDateTime end) {
        if (value == null)
            return false;
        if (start != null && value.isBefore(start))
            return false;
        if (end != null && value.isAfter(end))
            return false;
        return true;
    }

    private PaymentInfoResponse toPaymentInfo(ThanhToanHocPhi p) {
        PaymentInfoResponse dto = new PaymentInfoResponse();
        dto.setPaymentId(p.getId());
        if (p.getHocPhi() != null) {
            dto.setHocPhiId(p.getHocPhi().getId());
            if (p.getHocPhi().getHocVien() != null && p.getHocPhi().getHocVien().getUsers() != null) {
                dto.setHocVienId(p.getHocPhi().getHocVien().getId());
                dto.setHocVienName(p.getHocPhi().getHocVien().getUsers().getHoTen());
            }
            dto.setAmount(Optional.ofNullable(p.getHocPhi().getSoTien()).orElse(0.0));
        }
        dto.setNgayThanhToan(p.getNgayThanhToan());
        dto.setPhuongThucThanhToan(p.getPhuongThucThanhToan());
        dto.setMaGiaoDichGateway(p.getMaGiaoDichGateway());
        dto.setFileChungTu(p.getFileChungTu());
        return dto;
    }

}
