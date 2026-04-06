package com.university.dto.request.auth;

import java.time.LocalDateTime;
import com.university.entity.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    private String username;

    private String password;

    private LocalDateTime createDate;

    public RegisterRequest(String username, String password, LocalDateTime createDate,
            Role role) {
        this.username = username;
        this.password = password;
        this.createDate = createDate;
    }
}
