package com.example.ProjectIS.Service.Implementation;

import com.example.ProjectIS.Model.Biller;
import com.example.ProjectIS.Repository.BillerRepository;
import com.example.ProjectIS.Service.BillerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillerServiceImplementation implements BillerService {
    @Autowired
    private BillerRepository billerRepository;

    @Override
    public List<Biller> getAllBillers() {
        return (List<Biller>) billerRepository.findAll();
    }

    @Override
    public Biller getBillerById(Long id) {
        return billerRepository.findById(id).orElse(null);
    }

    @Override
    public Biller getBillerByCode(String code) {
        return billerRepository.findByCode(code);
    }

    @Override
    public void saveBiller(Biller biller) {
        billerRepository.save(biller);
    }

    @Override
    public void deleteBiller(Long id) {
        billerRepository.deleteById(id);
    }
}
