package com.university.service.admin.excel;

import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.event.AnalysisEventListener;
import com.university.dto.request.admin.KhoaAdminRequestDTO;
import com.university.dto.response.admin.ExcelImportResult;
import com.university.entity.Khoa;
import com.university.entity.Truong;
import com.university.exception.SimpleMessageException;
import com.university.repository.admin.KhoaAdminRepository;
import com.university.repository.admin.TruongAdminRepository;
import org.springframework.beans.BeanUtils;

import java.util.*;

public class KhoaExcelListener extends
        AnalysisEventListener<KhoaAdminRequestDTO> {

    private final TruongAdminRepository truongRepository;
    private final KhoaAdminRepository khoaAdminRepository;

    private final List<Khoa> toSave = new ArrayList<>();
    private final List<String> errors = new ArrayList<>();

    private final Set<String> maKhoaInFile = new HashSet<>(); // Kiểm tra trùng trong file

    private final Set<String> maKhoaInDb; // Kiểm tra trùng trong db

    private static final int BATCH_COUNT = 100; // Tăng để hiệu suất tốt

    private int rowIndex = 1;

    public KhoaExcelListener(TruongAdminRepository truongRepository, KhoaAdminRepository khoaAdminRepository) {
        this.truongRepository = truongRepository;
        this.khoaAdminRepository = khoaAdminRepository;
        this.maKhoaInDb = new HashSet<>(khoaAdminRepository.findAllMaKhoa());
    }

    @Override
    public void invoke(KhoaAdminRequestDTO data, AnalysisContext context) {
        rowIndex++;

        if (data == null || data.getMaKhoa() == null ||
                data.getMaKhoa().trim().isEmpty()) {
            errors.add("Dòng " + rowIndex + ": Mã trường không được để trống");
            return;
        }

        // Làm sạch dữ liệu
        String maKhoa = data.getMaKhoa().trim().toUpperCase(); // Giả sử mã trường viết hoa
        data.setMaKhoa(maKhoa);

        // === KIỂM TRA HỢP LỆ ===
        if (maKhoa.length() > 10) {
            errors.add("Dòng " + rowIndex + ": Mã trường tối đa 10 ký tự");
            return;
        }

        if (data.getTruongId() == null) {
            errors.add("Dòng " + rowIndex + ": ID Trường không được để trống");
            return;
        }

        Truong truong = truongRepository.findById(data.getTruongId())
                .orElseThrow(() -> new SimpleMessageException("Trường không tồn tại"));

        // Kiểm tra trùng trong cùng file Excel
        if (maKhoaInFile.contains(maKhoa)) {
            errors.add("Dòng " + rowIndex + ": Mã khoa '" + maKhoa + "' bị trùng lặp trong file Excel");
            return;
        }
        maKhoaInFile.add(maKhoa);

        // Kiểm tra tồn tại trong Database (cách này an toàn và rõ ràng)
        if (maKhoaInDb.contains(maKhoa)) {
            errors.add("Dòng " + rowIndex + ": Mã khoa '" + maKhoa + "' đã tồn tại trong cơ sở dữ liệu");
            return;
        }

        // Chuyển sang Entity
        Khoa khoa = new Khoa();
        BeanUtils.copyProperties(data, khoa);
        khoa.setTruong(truong);
        toSave.add(khoa);

        // Lưu batch
        if (toSave.size() >= BATCH_COUNT) {
            saveBatch();
        }
    }

    private void saveBatch() {
        if (!toSave.isEmpty()) {
            try {
                khoaAdminRepository.saveAll(toSave);
            } catch (Exception e) {
                errors.add("Lỗi khi lưu batch: " + e.getMessage());
            } finally {
                toSave.clear();
            }
        }
    }

    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        saveBatch(); // Lưu nốt phần còn lại

        // Nếu muốn dùng @Transactional, nên gọi saveAll một lần duy nhất ở đây (tùy
        // thiết kế)
    }

    // Phương thức trả về kết quả import
    public ExcelImportResult getResult() {
        ExcelImportResult result = new ExcelImportResult();
        result.setTotalRows(rowIndex - 1); // Trừ đi header
        result.setSuccessCount(toSave.isEmpty() ? (rowIndex - 1 - errors.size()) : 0); // Nếu còn dữ liệu chưa lưu, coi
        // như chưa thành công
        result.setErrorCount(errors.size());
        result.setErrors(new ArrayList<>(errors));

        return result;
    }
}