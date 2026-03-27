// package com.university.service.admin;

// import com.university.dto.request.admin.KhoaRequestDTO;
// import com.university.dto.response.admin.KhoaResponseDTO;
// import com.university.entity.Khoa;
// import com.university.entity.Truong;
// import com.university.exception.ResourceNotFoundException;
// import com.university.mapper.admin.KhoaMapper;
// import com.university.repository.admin.KhoaRepository;
// import com.university.repository.admin.TruongRepository;

// import lombok.RequiredArgsConstructor;

// import org.springframework.stereotype.Service;
// import java.util.List;
// import java.util.UUID;

// @Service
// @RequiredArgsConstructor
// public class KhoaService {

//     private final KhoaRepository khoaRepository;
//     private final TruongRepository truongRepository;
//     private final KhoaMapper khoaMapper;

//     public KhoaResponseDTO create(KhoaRequestDTO dto) {
//         var truong = truongRepository.findById(dto.getTruongId())
//                 .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trường"));
//         var khoa = khoaMapper.toEntity(dto, truong);
//         return khoaMapper.toResponseDTO(khoaRepository.save(khoa));
//     }

//     public KhoaResponseDTO getById(UUID id) {
//         var khoa = khoaRepository.findById(id)
//                 .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khoa"));
//         return khoaMapper.toResponseDTO(khoa);
//     }

//     public List<KhoaResponseDTO> getAll() {
//         return khoaRepository.findAll().stream()
//                 .map(khoaMapper::toResponseDTO)
//                 .toList();
//     }

//     public List<KhoaResponseDTO> search(String keyword) {
//         return khoaRepository
//                 .findByMaKhoaContainingIgnoreCaseOrTenKhoaContainingIgnoreCase(keyword, keyword)
//                 .stream().map(khoaMapper::toResponseDTO)
//                 .toList();
//     }

//     public KhoaResponseDTO update(UUID id, KhoaRequestDTO dto) {
//         Khoa khoa = khoaRepository.findById(id)
//                 .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khoa"));

//         khoa.setMaKhoa(dto.getMaKhoa());
//         khoa.setTenKhoa(dto.getTenKhoa());

//         Truong truong = truongRepository.findById(dto.getTruongId())
//                 .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trường"));
//         khoa.setTruong(truong);

//         return khoaMapper.toResponseDTO(khoaRepository.save(khoa));
//     }

//     public void delete(UUID id) {
//         khoaRepository.deleteById(id);
//     }
// }