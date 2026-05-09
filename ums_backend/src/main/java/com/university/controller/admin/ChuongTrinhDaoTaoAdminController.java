package com.university.controller.admin;

import com.university.dto.request.admin.ChuongTrinhDaoTaoAdminRequestDTO;
import com.university.dto.response.admin.ChuongTrinhDaoTaoAdminResponseDTO;
import com.university.service.admin.ChuongTrinhDaoTaoAdminService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/chuong-trinh-dao-tao")
@RequiredArgsConstructor
public class ChuongTrinhDaoTaoAdminController {

    private final ChuongTrinhDaoTaoAdminService chuongTrinhDaoTaoAdminService;

    @PostMapping
    public ResponseEntity<ChuongTrinhDaoTaoAdminResponseDTO> create(
            @Valid @RequestBody ChuongTrinhDaoTaoAdminRequestDTO request) {
        ChuongTrinhDaoTaoAdminResponseDTO response = chuongTrinhDaoTaoAdminService.createCTDT(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<ChuongTrinhDaoTaoAdminResponseDTO>> createList(
            @Valid @RequestBody List<ChuongTrinhDaoTaoAdminRequestDTO> requests) {
        List<ChuongTrinhDaoTaoAdminResponseDTO> response = chuongTrinhDaoTaoAdminService.createListCTDT(requests);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ChuongTrinhDaoTaoAdminResponseDTO>> getAll() {
        return ResponseEntity.ok(chuongTrinhDaoTaoAdminService.getAllChuongTrinhDaoTao());
    }

    @GetMapping("/nganh/{nganhId}")
    public ResponseEntity<List<ChuongTrinhDaoTaoAdminResponseDTO>> getAllByNganh(@PathVariable UUID nganhId) {
        return ResponseEntity.ok(chuongTrinhDaoTaoAdminService.getAllChuongTrinhDaoTaoByNganh(nganhId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChuongTrinhDaoTaoAdminResponseDTO> getById(@PathVariable UUID id) {
        ChuongTrinhDaoTaoAdminResponseDTO response = chuongTrinhDaoTaoAdminService.getCTDTById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChuongTrinhDaoTaoAdminResponseDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody ChuongTrinhDaoTaoAdminRequestDTO request) {
        ChuongTrinhDaoTaoAdminResponseDTO response = chuongTrinhDaoTaoAdminService.updateCTDT(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        chuongTrinhDaoTaoAdminService.deleteCTDT(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete-list")
    public ResponseEntity<Void> deleteList(@RequestBody List<UUID> ids) {
        chuongTrinhDaoTaoAdminService.deleteAllByList(ids);
        return ResponseEntity.noContent().build();
    }
}
