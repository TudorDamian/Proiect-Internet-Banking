package com.example.ProjectIS.Service;

import com.example.ProjectIS.Model.Payment;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface PaymentService {
    List<Payment> getAllPayments();
    List<Payment> getPaymentsByBillerId(int billerId);
    void savePayment(Payment payment);
    void deletePayment(Long id);
}
