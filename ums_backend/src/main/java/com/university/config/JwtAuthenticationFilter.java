package com.university.config;

import com.university.security.CustomUserDetails;
import com.university.util.JwtUtil;

import jakarta.servlet.*;
import jakarta.servlet.http.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final RedisTemplate<String, Object> redisTemplate;

    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            // 1. Kiểm tra cấu trúc JWT (tránh lỗi 500 khi gửi UUID của Refresh Token vào
            // đây)
            long dotCount = token.chars().filter(ch -> ch == '.').count();
            if (dotCount != 2) {
                log.warn("JWT error: Invalid structure at URI: {}", request.getRequestURI());
                filterChain.doFilter(request, response);
                return;
            }

            try {
                String username = jwtUtil.extractUsername(token);
                String userId = jwtUtil.extractUserId(token);
                List<String> roles = jwtUtil.extractRoles(token);

                // 2. LẤY PERMISSIONS TỪ REDIS
                String redisKey = "user_permissions:" + userId;
                List<String> permissions = (List<String>) redisTemplate.opsForValue().get(redisKey);

                // 3. TẠO DANH SÁCH AUTHORITIES GỒM CẢ ROLES VÀ PERMISSIONS
                // Spring Security dùng danh sách này để check hasRole() hoặc hasAuthority()
                List<SimpleGrantedAuthority> authorities = new java.util.ArrayList<>();

                // Thêm Roles (Ví dụ: ROLE_ADMIN)
                if (roles != null) {
                    roles.forEach(role -> authorities.add(new SimpleGrantedAuthority(role)));
                }

                // Thêm Permissions (Ví dụ: USER_CREATE)
                if (permissions != null) {
                    permissions.forEach(perm -> authorities.add(new SimpleGrantedAuthority(perm)));
                }

                // 4. BUILD USER DETAILS
                CustomUserDetails userDetails = new CustomUserDetails(
                        UUID.fromString(userId),
                        username,
                        "", // Password để trống vì session đã auth
                        authorities,
                        null);

                // 5. SET VÀO SECURITY CONTEXT
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        authorities);

                SecurityContextHolder.getContext().setAuthentication(auth);

            } catch (Exception e) {
                log.error("JWT validation failed: {}", e.getMessage());
                // Xóa context nếu có lỗi để đảm bảo an toàn
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}