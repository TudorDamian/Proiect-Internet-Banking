package com.example.ProjectIS.Controller;

import com.example.ProjectIS.Model.Biller;
import com.example.ProjectIS.Service.BillerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@CrossOrigin
@RequestMapping("/billers")
public class BillerController {
    @Autowired
    private BillerService billerService;

    @GetMapping
    public List<Biller> getAllBillers() {
        return billerService.getAllBillers();
    }

    @GetMapping("/{id}")
    public Biller getBillerById(@PathVariable Long id) {
        return billerService.getBillerById(id);
    }

    @GetMapping("/by-code")
    public Biller getBillerByCode(@RequestParam String code) {
        return billerService.getBillerByCode(code);
    }

    @PostMapping
    public void saveBiller(@RequestBody Biller biller) {
        billerService.saveBiller(biller);
    }

    @DeleteMapping("/{id}")
    public void deleteBiller(@PathVariable Long id) {
        billerService.deleteBiller(id);
    }
}
