package com.university.dto.response.auth;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RefreshResponseDTO {
    private String accessToken;
    private String refreshToken;
    List<String> dRole;
}
