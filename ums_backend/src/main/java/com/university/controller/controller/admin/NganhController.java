// package com.university.controller.admin;

// import com.university.dto.request.admin.NganhRequestDTO;
// import com.university.dto.response.admin.NganhResponseDTO;
// import com.university.service.admin.NganhService;

// import jakarta.validation.Valid;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;
// import java.util.UUID;

// @RestController
// @RequestMapping("/nganh")
// @RequiredArgsConstructor
// public class NganhController {

//     private final NganhService nganhService;

//     @PostMapping
//     public ResponseEntity<NganhResponseDTO> create(@RequestBody @Valid NganhRequestDTO dto) {
//         return ResponseEntity.status(HttpStatus.CREATED).body(nganhService.create(dto));
//     }

//     @GetMapping("/{id}")
//     public ResponseEntity<NganhResponseDTO> getById(@PathVariable UUID id) {
//         return ResponseEntity.ok(nganhService.getById(id));
//     }

//     @GetMapping
//     public ResponseEntity<List<NganhResponseDTO>> getAll() {
//         return ResponseEntity.ok(nganhService.getAllNganhResponseDTO());
//     }

//     // @GetMapping("/search")
//     // public ResponseEntity<List<NganhResponseDTO>> search(@RequestParam String
//     // keyword) {
//     // return ResponseEntity.ok(nganhService.search(keyword));
//     // }

//     @PutMapping("/{id}")
//     public ResponseEntity<NganhResponseDTO> update(@PathVariable UUID id, @RequestBody @Valid NganhRequestDTO dto) {
//         return ResponseEntity.ok(nganhService.update(id, dto));
//     }

//     @DeleteMapping("/{id}")
//     public ResponseEntity<Void> delete(@PathVariable UUID id) {
//         nganhService.delete(id);
//         return ResponseEntity.noContent().build();
//     }
// }