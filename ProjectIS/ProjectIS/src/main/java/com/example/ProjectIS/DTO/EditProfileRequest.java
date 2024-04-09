package com.example.ProjectIS.DTO;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class EditProfileRequest {
    private Long profileId;
    private String profileFirstName;
    private String profileLastName;
    private String profilePhone;
}