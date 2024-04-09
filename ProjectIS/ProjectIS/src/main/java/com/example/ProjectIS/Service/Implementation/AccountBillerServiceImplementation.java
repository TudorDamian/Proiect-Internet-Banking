package com.example.ProjectIS.Service.Implementation;

import com.example.ProjectIS.Model.AccountBiller;
import com.example.ProjectIS.Repository.AccountBillerRepository;
import com.example.ProjectIS.Service.AccountBillerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountBillerServiceImplementation implements AccountBillerService {
    @Autowired
    private AccountBillerRepository accountBillerRepository;

    @Override
    public List<AccountBiller> getAllAccountBillers() {
        return (List<AccountBiller>) accountBillerRepository.findAll();
    }

    @Override
    public void saveAccountBiller(AccountBiller accountBiller) {
        accountBillerRepository.save(accountBiller);
    }

    @Override
    public void deleteAccountBiller(AccountBiller accountBiller) {
        accountBillerRepository.delete(accountBiller);
    }
}
