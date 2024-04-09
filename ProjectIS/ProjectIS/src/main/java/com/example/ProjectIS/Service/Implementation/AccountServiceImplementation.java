package com.example.ProjectIS.Service.Implementation;

import com.example.ProjectIS.DTO.AccountCreateRequest;
import com.example.ProjectIS.Model.Account;
import com.example.ProjectIS.Model.Transaction;
import com.example.ProjectIS.Model.User;
import com.example.ProjectIS.Repository.AccountRepository;
import com.example.ProjectIS.Service.AccountService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;


@RequiredArgsConstructor
@Service
public class AccountServiceImplementation implements AccountService {

    @Autowired
    private AccountRepository accountRepository;
    private final UserServiceImplementation userServiceImplementation;

    public Long GenerateRandomAccountNumber() {
        Random random = new Random();
        return 1000_0000_0000L + (long) (random.nextDouble() * 9000_0000_0000L);
    }

    @Override
    public ResponseEntity Insert(AccountCreateRequest accountCreateRequest) {
        if(accountCreateRequest.getBalance() <= 0.0) {
               return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Not a positive balance!");
        }
        Long accountNr = GenerateRandomAccountNumber();
        while(accountRepository.findFirstByAccountNr(accountNr) != null){
            accountNr = GenerateRandomAccountNumber();
        }

        Account account = new Account(
                accountCreateRequest.getUserId(),
                accountNr,
                accountCreateRequest.getAccountType(),
                accountCreateRequest.getBalance()
        );
        accountRepository.save(account);
        User user = userServiceImplementation.findFirstByUserId(account.getUserId());
        List<Account> accounts = user.getAccounts();
        accounts.add(account);
        user.setAccounts(accounts);
        userServiceImplementation.Update(user);
        return ResponseEntity.status(HttpStatus.OK).body(account);
    }

    @Override
    public void Update(Account account) {
        Account existingAccount = accountRepository.findFirstByAccountId(account.getAccountId());
        if (existingAccount != null) {
            existingAccount.setUserId(account.getUserId());
            existingAccount.setAccountNr(account.getAccountNr());
            existingAccount.setAccountType(account.getAccountType());
            existingAccount.setBalance(account.getBalance());
            accountRepository.save(existingAccount);
        }
    }

    @Override
    public Iterable<Account> getAllAccountsByUserId(Long id) {
        System.out.println(accountRepository.findAccountsByUserId(id));
        return accountRepository.findAccountsByUserId(id);
    }

    @Override
    public Double getTotalBalance(Long id) {
        Double total = 0.0;
        List<Account> accounts = (List<Account>) accountRepository.findAccountsByUserId(id);
        for(Account account : accounts) {
            total += account.getBalance();
        }
        return total;
    }

    @Override
    public void DeleteById(Long id) {
        Account account = accountRepository.findFirstByAccountId(id);
        User user = userServiceImplementation.findFirstByUserId(account.getUserId());

        List<Account> accounts = user.getAccounts();
        accounts.remove(account);
        user.setAccounts(accounts);
        userServiceImplementation.Update(user);

        accountRepository.deleteById(id);
    }

    @Transactional
    @Override
    public void DeleteByUserId(Long id) {
        accountRepository.deleteAccountsByUserId(id);
    }

    @Override
    public Account findFirstByAccountId(Long id) {
        return accountRepository.findFirstByAccountId(id);
    }

    @Override
    public Iterable<Account> getAll() {
        return accountRepository.findAll();
    }
}
