// package com.university.controller.admin;

// import jakarta.validation.Valid;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import com.university.dto.request.admin.KhoaRequestDTO;
// import com.university.dto.response.admin.KhoaResponseDTO;
// import com.university.service.admin.KhoaService;

// import java.util.List;
// import java.util.UUID;

// @RestController
// @RequestMapping("/khoas")
// @RequiredArgsConstructor
// public class KhoaController {

//     private final KhoaService khoaService;

//     @PostMapping
//     public ResponseEntity<KhoaResponseDTO> create(@RequestBody @Valid KhoaRequestDTO dto) {
//         return ResponseEntity.status(HttpStatus.CREATED).body(khoaService.create(dto));
//     }

//     @GetMapping("/{id}")
//     public ResponseEntity<KhoaResponseDTO> getById(@PathVariable UUID id) {
//         return ResponseEntity.ok(khoaService.getById(id));
//     }

//     @GetMapping
//     public ResponseEntity<List<KhoaResponseDTO>> getAll() {
//         return ResponseEntity.ok(khoaService.getAll());
//     }

//     @GetMapping("/search")
//     public ResponseEntity<List<KhoaResponseDTO>> search(@RequestParam String keyword) {
//         return ResponseEntity.ok(khoaService.search(keyword));
//     }

//     @PutMapping("/{id}")
//     public ResponseEntity<KhoaResponseDTO> update(@PathVariable UUID id, @RequestBody @Valid KhoaRequestDTO dto) {
//         return ResponseEntity.ok(khoaService.update(id, dto));
//     }

//     @DeleteMapping("/{id}")
//     public ResponseEntity<Void> delete(@PathVariable UUID id) {
//         khoaService.delete(id);
//         return ResponseEntity.noContent().build();
//     }
// }