package com.example.ProjectIS.DTO;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ChangePasswordRequest {
    private Long userId;
    private String currentPassword;
    private String newPassword;
    private String confirmPassword;
}

