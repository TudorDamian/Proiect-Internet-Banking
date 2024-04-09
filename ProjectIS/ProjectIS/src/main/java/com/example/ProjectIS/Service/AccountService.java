package com.example.ProjectIS.Service;

import com.example.ProjectIS.DTO.AccountCreateRequest;
import com.example.ProjectIS.Model.Account;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public interface AccountService {
    ResponseEntity Insert(AccountCreateRequest accountCreateRequest);
    void Update(Account account);
    void DeleteById(Long id);
    void DeleteByUserId(Long id);
    Account findFirstByAccountId(Long id);
    Iterable<Account> getAll();
    Iterable<Account> getAllAccountsByUserId(Long id);
    Double getTotalBalance(Long id);

}
