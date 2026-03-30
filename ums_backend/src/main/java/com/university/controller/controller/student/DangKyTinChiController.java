// package com.university.controller.controller.student;

// import java.util.List;

// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.DeleteMapping;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;
// import org.springframework.web.bind.annotation.PathVariable;
// import com.university.dto.response.student.DangKyTinChiResponseDTO;
// import com.university.repository.student.DangKyTinChiRepository;
// import com.university.service.student.DangKyTinChiService;
// import jakarta.validation.Valid;
// import lombok.RequiredArgsConstructor;
// import com.university.dto.request.student.DangKyTinChiRequestDTO;
// import com.university.dto.request.student.HuyTinChiRequestDTO;
// // import com.university.dto.response.ApiResponse;
// import java.util.UUID;


// @RestController
// @RequestMapping("/api/student/dang-ky-tin-chi")
// @RequiredArgsConstructor
// public class DangKyTinChiController {
//     private final DangKyTinChiService dangKyTinChiService;

//     @PostMapping
//     public ResponseEntity<DangKyTinChiRepository> DangKy(@RequestBody @Valid DangKyTinChiRequestDTO request) {
//         return ResponseEntity.ok(dangKyTinChiService.DangKy(request)); 
//     }
    
//     @DeleteMapping
//     public ResponseEntity<Void> huyDangKyTinChi(@RequestBody @Valid HuyTinChiRequestDTO request) {
//         dangKyTinChiService.HuyDangKyTinChi(request);
//         return ResponseEntity.noContent().build();
//     }

//     @GetMapping("/{hocvienid}")
//     public ResponseEntity<List<DangKyTinChiResponseDTO>> getDangKyTinChiByHocVienId(@PathVariable("hocvienid") UUID hocVienId) {
//         return ResponseEntity.ok(dangKyTinChiService.getDangKyTinChiByHocVienId(hocVienId));
//     }
// }
