// package com.university.service.admin;

// import com.alibaba.excel.EasyExcel;
// import com.university.dto.request.admin.MonHocAdminRequestDTO;
// import com.university.dto.response.admin.MonHocAdminResponseDTO;
// import com.university.entity.MonHoc;
// import com.university.exception.SimpleMessageException;
// import com.university.mapper.admin.MonHocAdminMapper;
// import com.university.repository.admin.MocHocAdminRepository;
// import com.university.service.admin.excel.MonHocExcelListener;

// import io.jsonwebtoken.io.IOException;
// import jakarta.transaction.Transactional;
// import lombok.RequiredArgsConstructor;

// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;

// import java.util.List;
// import java.util.UUID;

// @Service
// @RequiredArgsConstructor
// public class MonHocAdminService {
// private final MonHocAdminMapper monHocAdminMapper;
// private final MocHocAdminRepository monHocAdminRepository;

// public void importMonHocExcel(MultipartFile file) throws IOException,
// java.io.IOException {
// EasyExcel.read(file.getInputStream(), MonHocAdminRequestDTO.class,
// new MonHocExcelListener(monHocAdminRepository))
// .sheet()
// .headRowNumber(1)
// .doRead();
// }

// public List<MonHocAdminResponseDTO> getAllMonHoc() {
// List<MonHoc> list = monHocAdminRepository.findAll();
// return list.stream().map(monHoc -> {
// MonHocAdminResponseDTO dto = new MonHocAdminResponseDTO();
// dto.setId(monHoc.getId());
// dto.setMaMonHoc(monHoc.getMaMonHoc());
// dto.setTenMonHoc(monHoc.getTenMonHoc());
// dto.setSoTinChi(monHoc.getSoTinChi());
// dto.setMoTa(monHoc.getMoTa());
// return dto;
// }).toList();
// }

// public void create(MonHocAdminRequestDTO dto) {
// MonHoc monHoc = monHocAdminMapper.toEntity(dto);
// monHocAdminRepository.save(monHoc);
// }

// @Transactional
// public void createMonHoc(MonHocAdminRequestDTO request) {
// MonHoc monHoc = monHocAdminMapper.toEntity(request);
// monHocAdminRepository.save(monHoc);
// }

// @Transactional
// public void updateMonHoc(UUID id, MonHocAdminRequestDTO request) {
// MonHoc monHoc = monHocAdminRepository.findById(id)
// .orElseThrow(() -> new SimpleMessageException("Môn học không tồn tại"));
// monHocAdminMapper.updateEntity(monHoc, request);
// monHocAdminRepository.save(monHoc);
// }
// }