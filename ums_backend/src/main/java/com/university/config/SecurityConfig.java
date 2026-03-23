package com.university.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(csrf -> csrf.disable()) // REST API thường disable

                                .authorizeHttpRequests(auth -> auth
                                                // Public endpoints
                                                .requestMatchers(
                                                                "/api/**",
                                                                "/api/auth/**",
                                                                "/api/public/**")
                                                .permitAll()

                                                // Actuator nếu cần
                                                // .requestMatchers("/actuator/health").permitAll()

                                                // Tất cả còn lại phải auth (sẽ dùng JWT hoặc session sau)
                                                .anyRequest().authenticated());

                // Nếu sau này thêm JWT:
                // http.oauth2ResourceServer(oauth2 -> oauth2.jwt());

                // Nếu dùng form login (web):
                // http.formLogin(Customizer.withDefaults());

                return http.build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder(12); // strength 12 là tốt
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }
}