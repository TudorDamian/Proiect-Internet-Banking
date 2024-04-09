package com.example.ProjectIS.Service;

import com.example.ProjectIS.Model.Biller;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface BillerService {
    List<Biller> getAllBillers();
    Biller getBillerById(Long id);
    Biller getBillerByCode(String code);
    void saveBiller(Biller biller);
    void deleteBiller(Long id);
}
