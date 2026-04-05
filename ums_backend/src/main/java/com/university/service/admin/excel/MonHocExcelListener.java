package com.university.service.admin.excel;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;

import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.event.AnalysisEventListener;
import com.university.dto.request.admin.MonHocAdminRequestDTO;
import com.university.entity.MonHoc;
import com.university.repository.admin.MocHocAdminRepository;

public class MonHocExcelListener extends
        AnalysisEventListener<MonHocAdminRequestDTO> {

    private final MocHocAdminRepository mocHocAdminRepository;
    private final List<MonHoc> listMonHocs = new ArrayList<>();
    // private static final int BATCH_COUNT = 50; // Lưu mỗi lần 50 bản ghi

    public MonHocExcelListener(MocHocAdminRepository mocHocAdminRepository) {
        this.mocHocAdminRepository = mocHocAdminRepository;
    }

    @Override
    public void invoke(MonHocAdminRequestDTO data, AnalysisContext context) {
        // 1. Kiểm tra nếu dòng trắng hoặc maTruong bị null
        if (data.getMaMonHoc() == null)
            return;

        // 2. Xử lý xóa khoảng trắng thừa đầu cuối
        String maMonHoc = data.getMaMonHoc().trim();

        // 3. Nếu dữ liệu vẫn bị dính chùm (ví dụ: "AAA BBB"), ta tách lấy phần đầu tiên
        if (maMonHoc.contains(" ")) {
            // Tách chuỗi theo khoảng trắng và lấy phần tử đầu tiên làm maTruong
            String[] parts = maMonHoc.split("\\s+");
            data.setMaMonHoc(parts[0]);

            // Nếu các cột khác bị null, ta có thể lấy phần còn lại gán vào (nếu file lỗi
            // định dạng)
            if (data.getTenMonHoc() == null && parts.length > 1) {
                data.setTenMonHoc(parts[1]);
            }
        } else {
            data.setMaMonHoc(maMonHoc); // Nếu không có khoảng trắng, giữ nguyên
        }

        // 4. Chuyển sang Entity và lưu (như code cũ)
        MonHoc monHoc = new MonHoc();
        BeanUtils.copyProperties(data, monHoc); // Copy các trường giống nhau
        // ... set thêm ngày tháng nếu cần

        listMonHocs.add(monHoc);
    }

    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        saveData(); // Lưu nốt số còn lại
    }

    private void saveData() {
        if (!listMonHocs.isEmpty()) {
            mocHocAdminRepository.saveAll(listMonHocs);
        }
    }
}
