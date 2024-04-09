package com.example.ProjectIS.Service.Implementation;

import com.example.ProjectIS.Model.Payment;
import com.example.ProjectIS.Repository.PaymentRepository;
import com.example.ProjectIS.Service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentServiceImplementation implements PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public List<Payment> getAllPayments() {
        return (List<Payment>) paymentRepository.findAll();
    }

    @Override
    public List<Payment> getPaymentsByBillerId(int billerId) {
        return paymentRepository.findByBillerId(billerId);
    }

    @Override
    public void savePayment(Payment payment) {
        paymentRepository.save(payment);
    }

    @Override
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
}
