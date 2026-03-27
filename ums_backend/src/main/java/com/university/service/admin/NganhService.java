// package com.university.service.admin;

// import com.university.dto.request.admin.NganhRequestDTO;
// import com.university.dto.response.admin.NganhResponseDTO;
// import com.university.entity.Khoa;
// import com.university.entity.Nganh;
// import com.university.exception.ResourceNotFoundException;
// import com.university.exception.SimpleMessageException;
// import com.university.mapper.admin.NganhMapper;
// import com.university.repository.admin.KhoaRepository;
// import com.university.repository.admin.NganhRepository;

// import jakarta.persistence.EntityNotFoundException;
// import lombok.RequiredArgsConstructor;

// import org.springframework.stereotype.Service;
// import java.util.List;
// import java.util.UUID;
// import java.util.stream.Collectors;

// @Service
// @RequiredArgsConstructor
// public class NganhService {

//     private final NganhRepository nganhRepository;
//     private final NganhMapper nganhMapper;
//     private final KhoaRepository khoaRepository;

//     public NganhResponseDTO create(NganhRequestDTO dto) {
//         if (nganhRepository.findByMaNganh(dto.getMaNganh()).isPresent()) {
//             throw new SimpleMessageException("Mã ngành đã tồn tại");
//         }
//         Nganh nganh = nganhMapper.toEntity(dto);
//         return nganhMapper.toResponseDTO(nganhRepository.save(nganh));
//     }

//     public List<NganhResponseDTO> getAllNganhResponseDTO() {
//         return nganhRepository.findAll().stream()
//                 .map(nganhMapper::toResponseDTO)
//                 .collect(Collectors.toList());
//     }

//     public NganhResponseDTO getById(UUID id) {
//         Nganh nganh = nganhRepository.findById(id)
//                 .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ngành"));
//         return nganhMapper.toResponseDTO(nganh);
//     }

//     public List<NganhResponseDTO> search(String keyword) {
//         return nganhRepository.searchByTenNganh(keyword).stream()
//                 .map(nganhMapper::toResponseDTO)
//                 .collect(Collectors.toList());
//     }

//     public NganhResponseDTO update(UUID id, NganhRequestDTO dto) {
//         Nganh existing = nganhRepository.findById(id)
//                 .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ngành"));
//         Khoa khoa = khoaRepository.findById(dto.getKhoaId())
//                 .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khoa" + dto.getKhoaId()));

//         existing.setMaNganh(dto.getMaNganh());
//         existing.setTenNganh(dto.getTenNganh());
//         existing.setKhoa(khoa);

//         return nganhMapper.toResponseDTO(nganhRepository.save(existing));
//     }

//     public void delete(UUID id) {
//         nganhRepository.deleteById(id);
//     }
// }