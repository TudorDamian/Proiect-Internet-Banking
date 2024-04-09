package com.example.ProjectIS.Controller;

import com.example.ProjectIS.Model.Payment;
import com.example.ProjectIS.Service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@CrossOrigin
@RequestMapping("/payments")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/by-biller")
    public List<Payment> getPaymentsByBillerId(@RequestParam int billerId) {
        return paymentService.getPaymentsByBillerId(billerId);
    }

    @PostMapping
    public void savePayment(@RequestBody Payment payment) {
        paymentService.savePayment(payment);
    }

    @DeleteMapping("/{id}")
    public void deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
    }
}
