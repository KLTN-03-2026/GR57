package com.university.service.auth;

import com.university.dto.response.auth.AuthResponseDTO;
import com.university.dto.response.auth.LoginResponseDTO;
import com.university.entity.Users;
import com.university.exception.NotFoundException;
import com.university.exception.SimpleMessageException;
import com.university.repository.admin.UsersAdminRepository;
import com.university.security.CustomUserDetails;
import com.university.util.JwtUtil;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UsersAdminRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtil jwtUtil;
        private final RefreshTokenService refreshTokenService;
        private final RedisTemplate<String, Object> redisTemplate;

        @Transactional
        public LoginResponseDTO authenticate(String userName, String rawPassword) {
                LoginResponseDTO.UserLoginProjection user = userRepository.findByUserLoginProjection(userName)
                                .orElseThrow(() -> new SimpleMessageException("Tài khoản hoặc mật khẩu không đúng"));
                System.out.println(passwordEncoder.encode("123"));
                // 🔹 2. Check trạng thái
                if (!Boolean.TRUE.equals(user.isTrangThai())) {
                        throw new SimpleMessageException("Tài khoản đã bị khóa! " +
                                        (user.getGhiChu() != null ? user.getGhiChu() : ""));
                }

                // 🔹 3. Check password

                if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
                        throw new SimpleMessageException("Tài khoản hoặc mật khẩu không đúng");
                }

                // 🔹 4. Lấy toàn bộ Roles & Permissions trong 1 câu Query duy nhất
                List<AuthResponseDTO> authData = userRepository.findAllRoleAndPermissionsByUserId(user.getId());
                // Tách lấy danh sách Roles (duy nhất)
                List<String> roles = authData.stream()
                                .map(AuthResponseDTO::getMaRole)
                                .distinct()
                                .toList();

                // Tách lấy danh sách Permissions (duy nhất)
                List<String> permissions = authData.stream()
                                .map(AuthResponseDTO::getMaPermissions)
.filter(p -> p != null) // Tránh trường hợp Role chưa được gán Permission
                                .distinct()
                                .toList();

                // 1. LƯU PERMISSIONS VÀO REDIS (Thời gian sống bằng thời gian của Refresh
                String redisKey = "user_permissions:" + user.getId();
                redisTemplate.opsForValue().set(redisKey, permissions, 7, TimeUnit.DAYS);
                // 5. Tạo danh sách Authorities (Spring Security cần để phân quyền
                List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                roles.forEach(r -> authorities.add(new SimpleGrantedAuthority("ROLE_" + r)));

                // 6. Build UserDetails (Truyền thêm danh sách permissions riêng)
                CustomUserDetails userDetails = new CustomUserDetails(
                                user.getId(),
                                user.getUserName(),
                                user.getPassword(),
                                authorities,
                                null);

                // 🔹 6. Generate token
                String accessToken = jwtUtil.generateAccessToken(userDetails);
                String refreshToken = refreshTokenService.createRefreshToken(user.getId().toString());

                // 🔹 7. Format role cho FE
                List<String> rolesForFrontend = userRepository.findAllRoleByUserId(user.getId());

                return LoginResponseDTO.builder()
                                .id(user.getId())
                                .userName(user.getUserName())
                                .fullName(user.getHoTen())
                                .accessToken(accessToken)
                                .refreshToken(refreshToken)
                                .dRole(rolesForFrontend)
                                .message("Đăng nhập thành công")
                                .build();
        }

        public String generateAccessTokenFromUserId(String userId) {
                // 1. Tìm user từ database
                Users user = userRepository.findById(UUID.fromString(userId))
                                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng"));

                // 2. Lấy danh sách Roles và Permissions từ Repository
                List<AuthResponseDTO> authData = userRepository.findAllRoleAndPermissionsByUserId(user.getId());

                // Tách lấy danh sách Roles (duy nhất)
                List<String> roles = authData.stream()
                                .map(AuthResponseDTO::getMaRole)
                                .distinct()
                                .toList();

                // Tách lấy danh sách Permissions (duy nhất)
                // List<String> permissions = authData.stream()
                // .map(AuthResponseDTO::getMaPermissions)
// .filter(p -> p != null) // Tránh trường hợp Role chưa được gán Permission
                // .distinct()
                // .toList();

                // 3. Chuyển đổi roles thành GrantedAuthority (có tiền tố ROLE_)
                List<org.springframework.security.core.authority.SimpleGrantedAuthority> authorities = roles
                                .stream()
                                .map(role -> new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                "ROLE_" + role))
                                .toList();

                // 4. Khởi tạo CustomUserDetails với đầy đủ 5 tham số
                CustomUserDetails userDetails = new CustomUserDetails(
                                user.getId(),
                                user.getUsername(),
                                user.getPassword(),
                                authorities,
                                null);

                // 5. Tạo token thông qua JwtUtil
                return jwtUtil.generateAccessToken(userDetails);
        }

        public String Logout(String authHeader, String refreshToken) {
                // 1. Luôn ưu tiên xóa token dựa trên chính nó trong Redis (An toàn nhất)
                String userIdFromToken = refreshTokenService.getUserId(refreshToken);

                if (userIdFromToken != null) {
                        refreshTokenService.deleteToken(refreshToken, userIdFromToken);
                        return "Đăng xuất thành công";
                }

                // 2. Nếu không tìm thấy trong Redis bằng token, thử lấy từ Access Token
                try {
                        if (authHeader != null && authHeader.startsWith("Bearer ")) {
                                String token = authHeader.substring(7);
                                if (token.chars().filter(ch -> ch == '.').count() == 2) {
                                        String userId = jwtUtil.extractUserId(token);
                                        refreshTokenService.deleteToken(refreshToken, userId);
                                }
                        }
                } catch (Exception e) {
                        throw new NotFoundException("Không thể trích xuất UserId từ Access Token: {}" + e.getMessage());
                }

                return "Đăng xuất thành công";
        }
}