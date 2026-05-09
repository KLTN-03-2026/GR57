package com.university.controller.student;

import com.university.dto.response.student.HocKiStudentsResponseDTO;
import com.university.service.student.HocKiStudentsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/student/hoc-ki")
@RequiredArgsConstructor
public class HocKiStudentsController {

    private final HocKiStudentsService hocKiStudentsService;

    @GetMapping
    public ResponseEntity<List<HocKiStudentsResponseDTO>> getDanhSach() {
        return ResponseEntity.ok(hocKiStudentsService.getDanhSach());
    }
}
