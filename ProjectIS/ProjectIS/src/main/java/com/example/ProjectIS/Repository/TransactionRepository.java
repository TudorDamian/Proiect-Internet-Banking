package com.example.ProjectIS.Repository;

import com.example.ProjectIS.Model.Transaction;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TransactionRepository extends CrudRepository<Transaction, Long> {
    Iterable<Transaction> findTransactionsBySenderAccountId(Long id);
    Iterable<Transaction> findTransactionsByReceiverAccountId(Long id);
    Transaction findFirstByTransactionId(Long id);
    void deleteTransactionsBySenderAccountId(Long id);
    void deleteTransactionsByReceiverAccountId(Long id);
}
