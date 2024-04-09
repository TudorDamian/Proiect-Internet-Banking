package com.example.ProjectIS.Repository;

import com.example.ProjectIS.Model.Account;
import org.springframework.data.repository.CrudRepository;

public interface AccountRepository extends CrudRepository<Account, Long> {
    Account findFirstByAccountId(Long id);
    Account findFirstByAccountNr(Long accountNr);
    Iterable<Account> findAccountsByUserId(Long id);
    void deleteAccountsByUserId(Long id);
}
