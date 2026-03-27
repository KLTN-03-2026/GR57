// package com.university.service.admin;

// import com.university.dto.request.admin.TruongRequestDTO;
// import com.university.dto.response.admin.TruongResponseDTO;
// import com.university.entity.Truong;
// import com.university.mapper.admin.TruongMapper;
// import com.university.repository.admin.TruongRepository;

// import lombok.RequiredArgsConstructor;
// import org.springframework.stereotype.Service;

// import java.util.List;
// import java.util.UUID;

// @Service
// @RequiredArgsConstructor
// public class TruongService {

//     private final TruongRepository truongRepository;
//     private final TruongMapper truongMapper;

//     public List<TruongResponseDTO> getAll() {
//         return truongRepository.FindAllDTO();
//     }

//     public TruongResponseDTO getById(UUID id) {
//         TruongResponseDTO truong = truongRepository.FindTruongById(id);
//         return truong;
//     }

//     public TruongResponseDTO create(TruongRequestDTO dto) {
//         if (truongRepository.existsByMaTruong(dto.getMaTruong())) {
//             throw new RuntimeException("Mã trường đã tồn tại");
//         }
//         Truong truong = truongRepository.save(truongMapper.toEntity(dto));
//         return truongMapper.toResponseDTO(truong);
//     }

//     public TruongResponseDTO update(UUID id, TruongRequestDTO dto) {
//         Truong truong = truongRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Không tìm thấy trườnga"));
//         truongMapper.updateEntity(truong, dto);
//         truongRepository.save(truong);
//         return truongMapper.toResponseDTO(truong);
//     }

//     public void delete(UUID id) {
//         truongRepository.deleteById(id);
//     }

// }