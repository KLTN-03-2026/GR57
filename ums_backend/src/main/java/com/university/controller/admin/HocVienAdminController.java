package com.university.controller.admin;

import com.university.dto.request.admin.HocVienAdminRequestDTO;
import com.university.dto.request.admin.warrap.HocVienCreateRequestDTO;
import com.university.dto.response.admin.HocVienAdminResponseDTO;
import com.university.service.admin.HocVienAdminService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/hoc-vien")
@RequiredArgsConstructor
public class HocVienAdminController {

    private final HocVienAdminService hocVienAdminService;

    // Create a new học viên (with nested data via wrapper DTO)
    @PostMapping
    public ResponseEntity<HocVienAdminResponseDTO> create(
            @Valid @RequestBody HocVienCreateRequestDTO request) {
        HocVienAdminResponseDTO response = hocVienAdminService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Get all học viên (summary view)
    @GetMapping
    public ResponseEntity<List<HocVienAdminResponseDTO>> getAll() {
        return ResponseEntity.ok(hocVienAdminService.getAllHocVien());
    }

    // Get học viên by ID
    @GetMapping("/{id}")
    public ResponseEntity<HocVienAdminResponseDTO> getById(@PathVariable UUID id) {
        HocVienAdminResponseDTO response = hocVienAdminService.getHocVienById(id);
        return ResponseEntity.ok(response);
    }

    // Update học viên
    @PutMapping("/{id}")
    public ResponseEntity<HocVienAdminResponseDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody HocVienAdminRequestDTO request) {
        HocVienAdminResponseDTO response = hocVienAdminService.updateHocVien(id, request);
        return ResponseEntity.ok(response);
    }

    // Delete học viên
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        hocVienAdminService.deleteHocVien(id);
        return ResponseEntity.noContent().build();
    }
}
