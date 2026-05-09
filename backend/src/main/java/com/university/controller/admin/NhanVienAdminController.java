package com.university.controller.admin;

import com.university.dto.request.admin.NhanVienAdminRequestDTO;
import com.university.dto.request.admin.warrap.NhanVienCreateRequestDTO;
import com.university.dto.response.admin.ExcelImportResult;
import com.university.dto.response.admin.NhanVienAdminResponseDTO;
import com.university.dto.response.admin.warrap.NhanVienUsersResponseDTO;
import com.university.service.admin.NhanVienAdminService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/nhan-vien")
@RequiredArgsConstructor
public class NhanVienAdminController {
    private final NhanVienAdminService nhanVienAdminService;

    @PostMapping
    public ResponseEntity<NhanVienUsersResponseDTO> create(
            @Valid @RequestBody NhanVienCreateRequestDTO request) {
        NhanVienUsersResponseDTO response = nhanVienAdminService.createDTO(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/import-excel")
    public ResponseEntity<ExcelImportResult> importExcel(@RequestParam("file") MultipartFile file)
            throws java.io.IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        ExcelImportResult result = nhanVienAdminService.importFromExcel(file);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NhanVienAdminResponseDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody NhanVienAdminRequestDTO request) {
        NhanVienAdminResponseDTO response = nhanVienAdminService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NhanVienAdminResponseDTO> getById(@PathVariable UUID id) {
        NhanVienAdminResponseDTO response = nhanVienAdminService.getNhanVienById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<NhanVienAdminResponseDTO>> getAll() {
        return ResponseEntity.ok(nhanVienAdminService.getAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        nhanVienAdminService.deleteNhanVien(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete-list")
    public ResponseEntity<Void> deleteList(@RequestBody List<UUID> ids) {
        nhanVienAdminService.deleteAllByList(ids);
        return ResponseEntity.noContent().build();
    }
}
