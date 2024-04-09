package com.example.ProjectIS.DTO;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class EditUserProfileRequest {
    private Long userProfileId;
    private String userProfileEmail;
    private String userProfileFirstName;
    private String userProfileLastName;
    private String userProfilePassword;
    private String userProfilePhone;
}
