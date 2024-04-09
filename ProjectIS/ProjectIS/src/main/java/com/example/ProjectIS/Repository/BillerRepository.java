package com.example.ProjectIS.Repository;

import com.example.ProjectIS.Model.Biller;
import org.springframework.data.repository.CrudRepository;

public interface BillerRepository extends CrudRepository<Biller, Long> {
    // Custom query method to find a biller by code
    Biller findByCode(String code);

    // Add other custom query methods as needed
}
