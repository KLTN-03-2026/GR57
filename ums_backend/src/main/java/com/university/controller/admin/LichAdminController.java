package com.university.controller.admin;

import com.university.dto.request.admin.LichAdminRequestDTO;
import com.university.dto.response.admin.LichAdminResponseDTO;
import com.university.service.admin.LichAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/lich")
@RequiredArgsConstructor
public class LichAdminController {

    private final LichAdminService lichService;

    @PostMapping
    public ResponseEntity<LichAdminResponseDTO> createLich(
            @Valid @RequestBody LichAdminRequestDTO request) {
        LichAdminResponseDTO response = lichService.createLich(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LichAdminResponseDTO> updateLich(
            @PathVariable UUID id,
            @Valid @RequestBody LichAdminRequestDTO request) {
        LichAdminResponseDTO response = lichService.updateLich(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LichAdminResponseDTO> getLich(@PathVariable UUID id) {
        LichAdminResponseDTO response = lichService.getLichById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<LichAdminResponseDTO>> getAllLich() {
        return ResponseEntity.ok(lichService.getAllLich());
    }

    @GetMapping("/lop-hoc-phan/{id}")
    public ResponseEntity<List<LichAdminResponseDTO>> getAllLichByLopHocPhanId(@PathVariable UUID id) {
        return ResponseEntity.ok(lichService.getAllLichByLopHopPhan(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLich(@PathVariable UUID id) {
        lichService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete/by-list")
    public ResponseEntity<String> deleteList(@RequestBody List<UUID> ids) {
        lichService.deleteAllByList(ids);
        return ResponseEntity.ok("Xóa thành công " + ids.size() + " lich");
    }
}
