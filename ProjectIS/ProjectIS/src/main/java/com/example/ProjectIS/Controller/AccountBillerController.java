package com.example.ProjectIS.Controller;

import com.example.ProjectIS.Model.AccountBiller;
import com.example.ProjectIS.Service.AccountBillerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@CrossOrigin
@RequestMapping("/account-billers")
public class AccountBillerController {
    @Autowired
    private AccountBillerService accountBillerService;

    @GetMapping
    public List<AccountBiller> getAllAccountBillers() {
        return accountBillerService.getAllAccountBillers();
    }


    @PostMapping
    public void saveAccountBiller(@RequestBody AccountBiller accountBiller) {
        accountBillerService.saveAccountBiller(accountBiller);
    }

    @DeleteMapping
    public void deleteAccountBiller(@RequestBody AccountBiller accountBiller) {
        accountBillerService.deleteAccountBiller(accountBiller);
    }
}
