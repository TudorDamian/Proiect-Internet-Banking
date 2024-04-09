package com.example.ProjectIS.DTO;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TransactionCreateRequest {
    private Long senderAccountId;
    private Long receiverAccountId;
    private Long amount;
}
