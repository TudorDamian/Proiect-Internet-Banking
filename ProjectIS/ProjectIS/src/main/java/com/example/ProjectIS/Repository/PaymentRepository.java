package com.example.ProjectIS.Repository;

import com.example.ProjectIS.Model.Payment;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface PaymentRepository extends CrudRepository<Payment, Long> {
    // Custom query method to find payments by biller_id
    List<Payment> findByBillerId(int billerId);

    // Add other custom query methods as needed
}
