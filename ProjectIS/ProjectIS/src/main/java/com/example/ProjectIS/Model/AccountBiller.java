package com.example.ProjectIS.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class AccountBiller {
    @Id
    private Long account_idd;
    private Long biller_idd;

    @OneToOne
    private Account account;

    @OneToOne
    private Biller biller;
}
