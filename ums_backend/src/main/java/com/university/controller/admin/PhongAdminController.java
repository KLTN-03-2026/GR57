package com.university.controller.admin;

import com.university.dto.request.admin.PhongAdminRequestDTO;
import com.university.dto.response.admin.PhongAdminResponseDTO;
import com.university.service.admin.PhongAdminService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/phong")
@RequiredArgsConstructor
public class PhongAdminController {

    private final PhongAdminService phongAdminService;

    @PostMapping
    public ResponseEntity<?> create(
            @Valid @RequestBody PhongAdminRequestDTO request) {
        PhongAdminResponseDTO response = phongAdminService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/list")
    public ResponseEntity<?> createList(
            @Valid @RequestBody List<PhongAdminRequestDTO> request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(phongAdminService.createList(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable UUID id,
            @Valid @RequestBody PhongAdminRequestDTO request) {
        PhongAdminResponseDTO response = phongAdminService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable UUID id) {
        PhongAdminResponseDTO response = phongAdminService.getPhongById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(phongAdminService.getAllPhong());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        phongAdminService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/list/{id}")
    public ResponseEntity<?> deleteByList(@RequestBody List<UUID> ids) {
        phongAdminService.deleteAllByList(ids);
        return ResponseEntity.noContent().build();
    }
}
