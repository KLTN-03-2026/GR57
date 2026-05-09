package com.university.controller.admin;

import com.university.dto.request.admin.DangKyTinChiAdminRequestDTO;
import com.university.dto.response.admin.DangKyTinChiAdminResponseDTO;
import com.university.service.admin.DangKyTinChiAdminService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/dang-ky-tin-chi")
@RequiredArgsConstructor
public class DangKyTinChiAdminController {

    private final DangKyTinChiAdminService dangKyTinChiAdminService;

    @PostMapping
    public ResponseEntity<DangKyTinChiAdminResponseDTO> create(
            @Valid @RequestBody DangKyTinChiAdminRequestDTO request) {
        DangKyTinChiAdminResponseDTO response = dangKyTinChiAdminService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<DangKyTinChiAdminResponseDTO>> getAll() {
        return ResponseEntity.ok(dangKyTinChiAdminService.getAll());
    }

    @GetMapping("/hoc-vien/{hocVienId}")
    public ResponseEntity<List<DangKyTinChiAdminResponseDTO>> getAllByHocVien(@PathVariable UUID hocVienId) {
        return ResponseEntity.ok(dangKyTinChiAdminService.getAllByHocVien(hocVienId));
    }

    @GetMapping("/lop-hoc-phan/{lopHocPhanId}")
    public ResponseEntity<List<DangKyTinChiAdminResponseDTO>> getAllByLopHocPhan(@PathVariable UUID lopHocPhanId) {
        return ResponseEntity.ok(dangKyTinChiAdminService.getAllByLopHocPhan(lopHocPhanId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DangKyTinChiAdminResponseDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(dangKyTinChiAdminService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DangKyTinChiAdminResponseDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody DangKyTinChiAdminRequestDTO request) {
        return ResponseEntity.ok(dangKyTinChiAdminService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        dangKyTinChiAdminService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete-list")
    public ResponseEntity<Void> deleteList(@RequestBody List<UUID> ids) {
        dangKyTinChiAdminService.deleteAllByList(ids);
        return ResponseEntity.noContent().build();
    }
}
