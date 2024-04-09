package com.example.ProjectIS.Service;

import com.example.ProjectIS.Model.AccountBiller;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface AccountBillerService {
    List<AccountBiller> getAllAccountBillers();
    void saveAccountBiller(AccountBiller accountBiller);
    void deleteAccountBiller(AccountBiller accountBiller);
}
