package com.example.ProjectIS.Service;

import com.example.ProjectIS.DTO.TransactionCreateRequest;
import com.example.ProjectIS.DTO.TransactionsPrintRequest;
import com.example.ProjectIS.Model.Transaction;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface TransactionService {
    Iterable<Transaction> getAllTransactions();
    Iterable<Transaction> getTransactionsBySenderAccountId(Long accountId);
    Iterable<Transaction> getTransactionsByReceiverAccountId(Long accountId);
    void deleteTransactionsBySenderAccountId(Long accountId);
    void deleteTransactionsByReceiverAccountId(Long accountId);
    void deleteTransactionsByUserId(Long id);
    Iterable<TransactionsPrintRequest> getTransactionsByUserId(Long Id);
    ResponseEntity Insert(TransactionCreateRequest transactionCreateRequest);
    void Update(Transaction transaction);
    void DeleteById(Long id);
}
