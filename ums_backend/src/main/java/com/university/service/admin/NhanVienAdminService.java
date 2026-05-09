package com.university.service.admin;

import com.alibaba.excel.EasyExcel;
import com.university.dto.request.admin.NhanVienAdminRequestDTO;
import com.university.dto.request.admin.warrap.NhanVienCreateRequestDTO;
import com.university.dto.response.admin.ExcelImportResult;
import com.university.dto.response.admin.NhanVienAdminResponseDTO;
import com.university.dto.response.admin.warrap.NhanVienUsersResponseDTO;
import com.university.entity.NhanVien;
import com.university.entity.Users;
import com.university.exception.SimpleMessageException;
import com.university.mapper.admin.NhanVienAdminMapper;
import com.university.mapper.admin.UsersAdminMapper;
import com.university.repository.admin.NhanVienAdminRepository;
import com.university.repository.admin.UsersAdminRepository;
import com.university.service.admin.excel.NhanVienExcelListener;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NhanVienAdminService {

    private final NhanVienAdminRepository nhanVienAdminRepository;
    private final UsersAdminRepository usersRepository;
    private final NhanVienAdminMapper nhanVienAdminMapper;
    private final UsersAdminMapper usersAdminMapper;

    public ExcelImportResult importFromExcel(MultipartFile file) throws java.io.IOException {
        NhanVienExcelListener listener = new NhanVienExcelListener(nhanVienAdminRepository, usersRepository);

        EasyExcel.read(file.getInputStream(), NhanVienAdminRequestDTO.class, listener)
                .sheet("NhanVien")
                .headRowNumber(1)
                .doRead();

        return listener.getResult();
    }

    @Transactional
    public NhanVienUsersResponseDTO createDTO(NhanVienCreateRequestDTO nhanVienCreateRequestDTO) {
        String maNhanVien = normalizeMaNhanVien(nhanVienCreateRequestDTO.getNhanVienDetails().getMaNhanVien());
        if (nhanVienAdminRepository.existsByMaNhanVien(maNhanVien)) {
            throw new SimpleMessageException("Mã nhân viên đã tồn tại");
        }
        nhanVienCreateRequestDTO.getNhanVienDetails().setMaNhanVien(maNhanVien);

        Users users = usersAdminMapper.toEntity(nhanVienCreateRequestDTO.getUserDetails());
        usersRepository.save(users);
        NhanVien nhanVien = nhanVienAdminMapper.toEntity(nhanVienCreateRequestDTO.getNhanVienDetails());
        nhanVien.setUsers(users);

        nhanVienAdminRepository.save(nhanVien);

        NhanVienUsersResponseDTO nhanVienUsersRequestDTO = new NhanVienUsersResponseDTO();
        nhanVienUsersRequestDTO.setUserDetails(usersAdminMapper.toResponseDTO(users));
        nhanVienUsersRequestDTO.setNhanVienDetails(nhanVienAdminMapper.toResponseDTO(nhanVien));
        return nhanVienUsersRequestDTO;
    }

    public NhanVienAdminResponseDTO getNhanVienById(UUID id) {
        NhanVien nhanVien = nhanVienAdminRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Nhân viên không tồn tại"));
        return nhanVienAdminMapper.toResponseDTO(nhanVien);
    }

    public List<NhanVienAdminResponseDTO> getAll() {
        return nhanVienAdminRepository.findAllDTO();
    }

    @Transactional
    public NhanVienAdminResponseDTO update(UUID id, NhanVienAdminRequestDTO request) {
        NhanVien existing = nhanVienAdminRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Nhân viên không tồn tại"));

        String maNhanVien = normalizeMaNhanVien(request.getMaNhanVien());
        if (nhanVienAdminRepository.existsByMaNhanVienAndIdNot(maNhanVien, id)) {
            throw new SimpleMessageException("Mã nhân viên đã tồn tại");
        }
        request.setMaNhanVien(maNhanVien);

        nhanVienAdminMapper.updateEntity(existing, request);
        NhanVien updated = nhanVienAdminRepository.save(existing);
        return nhanVienAdminMapper.toResponseDTO(updated);
    }

    @Transactional
    public void deleteNhanVien(UUID id) {
        NhanVien nv = nhanVienAdminRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Nhân viên không tồn tại"));

        nhanVienAdminRepository.delete(nv);
    }

    @Transactional
    public void deleteAllByList(List<UUID> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }
        try {
            // Kiem tra user dang co trong cac db khac khong
            // for (UUID uuid : ids) {
            // if (usersAdminRepository.) {

            // }
            // }
            nhanVienAdminRepository.deleteAllByIdIn(ids);

        } catch (Exception e) {
            throw new SimpleMessageException("Lỗi khi xóa danh sách: " + e.getMessage());
        }
    }

    private String normalizeMaNhanVien(String maNhanVien) {
        if (maNhanVien == null || maNhanVien.trim().isEmpty()) {
            throw new SimpleMessageException("Mã nhân viên không được để trống");
        }

        String normalized = maNhanVien.trim().toUpperCase();
        if (normalized.length() > 10) {
            throw new SimpleMessageException("Mã nhân viên tối đa 10 ký tự");
        }

        return normalized;
    }
}
