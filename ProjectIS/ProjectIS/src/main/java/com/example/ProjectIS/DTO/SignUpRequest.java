package com.example.ProjectIS.DTO;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SignUpRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phone;
}
