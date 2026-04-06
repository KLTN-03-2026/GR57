package com.university.controller.auth;

import com.university.dto.request.auth.LoginRequestDTO;
import com.university.dto.request.auth.RegisterRequest;
import com.university.dto.response.auth.LoginResponseDTO;
import com.university.dto.response.auth.RegisterResponseDTO;
import com.university.service.auth.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        LoginResponseDTO response = authService.authenticate(request.getUsername(), request.getPassword());
        System.out.println("Đăng nhập thành công: " + response.getUsername());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }
}
