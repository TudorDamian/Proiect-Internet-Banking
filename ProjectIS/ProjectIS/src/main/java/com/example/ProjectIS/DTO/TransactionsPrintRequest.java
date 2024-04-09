package com.example.ProjectIS.DTO;

import lombok.*;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TransactionsPrintRequest {
    private LocalDate date;
    private String senderAccountType;
    private Long senderAccount;
    private String receiverName;
    private String receiverAccountType;
    private Long receiverAccount;
    private Long amount;
}
