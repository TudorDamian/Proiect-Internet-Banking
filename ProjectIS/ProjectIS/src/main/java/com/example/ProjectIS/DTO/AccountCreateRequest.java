package com.example.ProjectIS.DTO;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AccountCreateRequest {
    private Long userId;
    private String accountType;
    private Double balance;
}
