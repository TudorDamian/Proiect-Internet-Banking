package com.example.ProjectIS.Controller;

import com.example.ProjectIS.DTO.TransactionCreateRequest;
import com.example.ProjectIS.DTO.TransactionsPrintRequest;
import com.example.ProjectIS.Model.Transaction;
import com.example.ProjectIS.Service.Implementation.TransactionServiceImplementation;
import com.example.ProjectIS.Service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@CrossOrigin
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionServiceImplementation transactionServiceImplementation;

    @GetMapping("/GetAllTransactions")
    public ResponseEntity getAllTransactions() {
        Iterable<Transaction> transactions = transactionServiceImplementation.getAllTransactions();
        return ResponseEntity.status(HttpStatus.OK).body(transactions);
    }

    @PostMapping("/GetTransactionsBySenderId")
    public ResponseEntity getTransactionsBySenderId(@RequestBody Long id) {
        Iterable<Transaction> transactions = transactionServiceImplementation.getTransactionsBySenderAccountId(id);
        return ResponseEntity.status(HttpStatus.OK).body(transactions);
    }

    @PostMapping("/GetTransactionsByReceiverId")
    public ResponseEntity getTransactionsByReceiverId(@RequestBody Long id) {
        Iterable<Transaction> transactions = transactionServiceImplementation.getTransactionsByReceiverAccountId(id);
        return ResponseEntity.status(HttpStatus.OK).body(transactions);
    }

    @PostMapping("/GetTransactionsByUserId")
    public ResponseEntity getTransactionsByUserId(@RequestBody Long id) {
        Iterable<TransactionsPrintRequest> transactions = transactionServiceImplementation.getTransactionsByUserId(id);
        return ResponseEntity.status(HttpStatus.OK).body(transactions);
    }

    @PostMapping("/Insert")
    public ResponseEntity insert(@RequestBody TransactionCreateRequest transactionCreateRequest){
        System.out.println(transactionCreateRequest);
        return transactionServiceImplementation.Insert(transactionCreateRequest);
    }

    @PostMapping("/Update")
    public ResponseEntity update(@RequestBody Transaction transaction) {
        transactionServiceImplementation.Update(transaction);
        return ResponseEntity.status(HttpStatus.OK).body("Successfully updated!");
    }

    @PostMapping("/DeleteById")
    public ResponseEntity deleteById(@RequestBody Long id){
        transactionServiceImplementation.DeleteById(id);
        return ResponseEntity.status(HttpStatus.OK).body("Successfully deleted!");
    }

    @PostMapping("/DeleteByAccountId")
    public ResponseEntity deleteByAccountId(@RequestBody Long id){
        transactionServiceImplementation.deleteTransactionsByReceiverAccountId(id);
        transactionServiceImplementation.deleteTransactionsBySenderAccountId(id);
        return ResponseEntity.status(HttpStatus.OK).body("Successfully deleted!");
    }

    @PostMapping("/DeleteTransactionsByUserId")
    public ResponseEntity deleteTransactionsByUserId(@RequestBody Long id){
        transactionServiceImplementation.deleteTransactionsByUserId(id);
        return ResponseEntity.status(HttpStatus.OK).body("Successfully deleted!");
    }
}
