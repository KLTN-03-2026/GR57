package com.university.controller.admin;

import com.university.dto.request.admin.HocPhiAdminRequestDTO;
import com.university.dto.response.admin.HocPhiAdminResponseDTO;
import com.university.service.admin.HocPhiAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/hoc-phi")
@RequiredArgsConstructor
public class HocPhiAdminController {

    private final HocPhiAdminService hocPhiService;

    @PostMapping
    public ResponseEntity<HocPhiAdminResponseDTO> create(
            @Valid @RequestBody HocPhiAdminRequestDTO request) {
        HocPhiAdminResponseDTO response = hocPhiService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HocPhiAdminResponseDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody HocPhiAdminRequestDTO request) {
        HocPhiAdminResponseDTO response = hocPhiService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HocPhiAdminResponseDTO> getById(@PathVariable UUID id) {
        HocPhiAdminResponseDTO response = hocPhiService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/tao-theo-hoc-vien/{hocVienId}/{hocKiId}")
    public ResponseEntity<HocPhiAdminResponseDTO> createByHocVien(
            @PathVariable UUID hocVienId,
            @PathVariable UUID hocKiId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(hocPhiService.createByHocVien(hocVienId, hocKiId));
    }

    @GetMapping("/hoc-vien/{id}")
    public ResponseEntity<HocPhiAdminResponseDTO> getByHocVienId(@PathVariable UUID id) {
        return ResponseEntity.ok(hocPhiService.getAllHocPhiByHocVienId(id));
    }

    @GetMapping
    public ResponseEntity<List<HocPhiAdminResponseDTO.HocPhiView>> getAll() {
        return ResponseEntity.ok(hocPhiService.getAllView());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        hocPhiService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete/by-list")
    public ResponseEntity<String> deleteList(@RequestBody List<UUID> ids) {
        hocPhiService.deleteAllByList(ids);
        return ResponseEntity.ok("Xóa thành công " + ids.size() + " học phí");
    }
}
