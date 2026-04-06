package com.university.service.auth;

import com.university.dto.request.auth.RegisterRequest;
import com.university.dto.response.auth.LoginResponseDTO;
import com.university.dto.response.auth.RegisterResponseDTO;
import com.university.entity.Users;
import com.university.repository.admin.UsersAdminRepository;
import com.university.util.JwtUtil;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsersAdminRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;

    public AuthService(UsersAdminRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil,
            CustomUserDetailsService cUserDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.customUserDetailsService = cUserDetailsService;
    }

    public RegisterResponseDTO register(RegisterRequest request) {
        Users user = new Users();
        user.setUserName(request.getUsername());
        user.setPassWord(passwordEncoder.encode(request.getPassword()));
        user.setCreateAt(request.getCreateDate());

        user = userRepository.save(user);
        return new RegisterResponseDTO(user.getId(), user.getUsername(), user.getCreateAt());
    }

    @Transactional
    public LoginResponseDTO authenticate(String username, String rawPassword) {

        Users user = userRepository.findByUserName(username);
        if (user == null) {
            throw new EntityNotFoundException("Tài khoản không tồn tại");
        }

        if (!user.isTrangThai()) {
            throw new EntityNotFoundException("Tài khoản đã bị khóa!, note: " + user.getGhiChu());
        }

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new EntityNotFoundException("Sai mật khẩu");
        }

        // Lấy UserDetails có đầy đủ roles
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

        // Tạo token với roles thật
        String token = jwtUtil.generateToken(userDetails);

        // List<String> rolesForFrontend = userDetails.getAuthorities().stream()
        // .map(auth -> auth.getAuthority().replace("ROLE_", ""))
        // .toList();

        return new LoginResponseDTO(
                user.getUsername(),
                "ADMIN",
                token,
                user.getId());
    }
}
