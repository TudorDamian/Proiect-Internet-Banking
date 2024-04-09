package com.example.ProjectIS.Controller;

import com.example.ProjectIS.DTO.*;
import com.example.ProjectIS.Model.Account;
import com.example.ProjectIS.Service.Implementation.AccountServiceImplementation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@CrossOrigin
@RequestMapping("/accounts")
public class AccountController {

    private final AccountServiceImplementation accountServiceImplementation;

    @PostMapping("/GetById")
    public ResponseEntity getAccountById(@RequestBody Long id) {
        Account account = accountServiceImplementation.findFirstByAccountId(id);
        return ResponseEntity.status(HttpStatus.OK).body(account);
    }

    @PostMapping("/GetAccountsByUserId")
    public ResponseEntity getAccountsByUserId(@RequestBody Long id) {
        Iterable<Account> accounts = accountServiceImplementation.getAllAccountsByUserId(id);
        return ResponseEntity.status(HttpStatus.OK).body(accounts);
    }

    @PostMapping("/GetTotalBalance")
    public ResponseEntity getTotalBalance(@RequestBody Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(accountServiceImplementation.getTotalBalance(id));
    }

    @PostMapping("/CreateAccount")
    public ResponseEntity createAccount(@RequestBody AccountCreateRequest accountCreateRequest) {
        return accountServiceImplementation.Insert(accountCreateRequest);
    }

    @GetMapping("/GetAll")
    public ResponseEntity getAllAccounts() {
        Iterable<Account> accounts = accountServiceImplementation.getAll();
        return ResponseEntity.status(HttpStatus.OK).body(accounts);
    }

    @PostMapping("/Update")
    public ResponseEntity updateAccount(@RequestBody Account account) {
        accountServiceImplementation.Update(account);
        Account account1 = accountServiceImplementation.findFirstByAccountId(account.getAccountId());
        return ResponseEntity.status(HttpStatus.OK).body(account1);
    }

    @PostMapping("/DeleteById")
    public ResponseEntity deleteAccount(@RequestBody Long id) {
        accountServiceImplementation.DeleteById(id);
        return ResponseEntity.status(HttpStatus.OK).body("Account deleted successfully");
    }

    @PostMapping("/DeleteAccountsByUserId") /// admin only
    public ResponseEntity deleteAccountsByUserId(@RequestBody Long id) {
        accountServiceImplementation.DeleteByUserId(id);
        return ResponseEntity.status(HttpStatus.OK).body("Accounts deleted successfully");
    }
}
