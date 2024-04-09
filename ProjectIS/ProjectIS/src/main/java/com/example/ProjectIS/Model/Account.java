package com.example.ProjectIS.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;
    private Long userId;
    private Long accountNr;
    private String accountType;
    private Double balance;

    public Account(Long userId, Long accountNr, String accountType,Double balance){
        this.userId = userId;
        this.accountNr = accountNr;
        this.accountType = accountType;
        this.balance = balance;
    }
}
