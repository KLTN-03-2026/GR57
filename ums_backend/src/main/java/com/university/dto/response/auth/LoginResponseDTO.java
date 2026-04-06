package com.university.dto.response.auth;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDTO {
    private String username;
    // List<String> dRole;
    String mRole;
    private String token;
    private UUID id;
}
