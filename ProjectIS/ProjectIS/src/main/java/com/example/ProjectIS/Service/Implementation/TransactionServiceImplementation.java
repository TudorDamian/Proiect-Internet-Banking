package com.example.ProjectIS.Service.Implementation;

import com.example.ProjectIS.DTO.TransactionCreateRequest;
import com.example.ProjectIS.DTO.TransactionsPrintRequest;
import com.example.ProjectIS.Model.Account;
import com.example.ProjectIS.Model.Transaction;
import com.example.ProjectIS.Model.User;
import com.example.ProjectIS.Repository.TransactionRepository;
import com.example.ProjectIS.Service.TransactionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class TransactionServiceImplementation implements TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;
    private final AccountServiceImplementation accountServiceImplementation;
    private final UserServiceImplementation userServiceImplementation;

    @Override
    public Iterable<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @Override
    public Iterable<Transaction> getTransactionsBySenderAccountId(Long id) {
        return transactionRepository.findTransactionsBySenderAccountId(id);
    }

    @Override
    public Iterable<Transaction> getTransactionsByReceiverAccountId(Long id) {
        return transactionRepository.findTransactionsByReceiverAccountId(id);
    }

    @Transactional
    @Override
    public void deleteTransactionsBySenderAccountId(Long id) {
        System.out.println("Sender id: " + id + "\n\n\n");
        transactionRepository.deleteTransactionsBySenderAccountId(id);
    }
    @Transactional
    @Override
    public void deleteTransactionsByReceiverAccountId(Long id) {
        System.out.println("Receiver id: " + id + "\n\n\n");
        transactionRepository.deleteTransactionsByReceiverAccountId(id);
    }

    @Transactional
    @Override
    public void deleteTransactionsByUserId(Long id) {
        List<Account> accounts = (List<Account>) accountServiceImplementation.getAllAccountsByUserId(id);
        for(Account account : accounts) {
            deleteTransactionsByReceiverAccountId(account.getAccountId());
            deleteTransactionsBySenderAccountId(account.getAccountId());
        }
//        userServiceImplementation.DeleteById(id);
//        accountServiceImplementation.DeleteByUserId(id);
    }

    @Override
    public Iterable<TransactionsPrintRequest> getTransactionsByUserId(Long id) {
        List<Account> accounts = (List<Account>) accountServiceImplementation.getAllAccountsByUserId(id);
        List<Transaction> transactions = new ArrayList<>();

        List<Transaction> transactionsByReceiver = new ArrayList<>();
        List<Transaction> transactionsBySender = new ArrayList<>();
        for(Account account : accounts){
            transactionsByReceiver.addAll((List<Transaction>) transactionRepository.findTransactionsByReceiverAccountId(account.getAccountId()));
            transactionsBySender.addAll((List<Transaction>) transactionRepository.findTransactionsBySenderAccountId(account.getAccountId()));
            transactions.addAll(transactionsBySender);
            transactions.addAll(transactionsByReceiver);
        }

        List<TransactionsPrintRequest> transactionsPrintRequests = new ArrayList<>();
//        System.out.println("Lista Receiver:\n\n\n\n" + transactionsByReceiver + "\n\n\n");
        for(Transaction transaction : transactionsByReceiver){
            Account account = accountServiceImplementation.findFirstByAccountId(transaction.getSenderAccountId());
            User receiverUser = userServiceImplementation.findFirstByUserId(account.getUserId());
            TransactionsPrintRequest transactionsPrintRequest = new TransactionsPrintRequest(
                    transaction.getDate(),
                    accountServiceImplementation.findFirstByAccountId(transaction.getSenderAccountId()).getAccountType(),
                    accountServiceImplementation.findFirstByAccountId(transaction.getSenderAccountId()).getAccountNr(),
                    receiverUser.getFirstName() + " " + receiverUser.getLastName(),
                    accountServiceImplementation.findFirstByAccountId(transaction.getReceiverAccountId()).getAccountType(),
                    accountServiceImplementation.findFirstByAccountId(transaction.getReceiverAccountId()).getAccountNr(),
                    transaction.getAmount()
            );
            transactionsPrintRequests.add(transactionsPrintRequest);
        }
//        System.out.println("Lista Sender:\n\n\n\n" + transactionsBySender + "\n\n\n");
        for(Transaction transaction : transactionsBySender){
            Account account = accountServiceImplementation.findFirstByAccountId(transaction.getReceiverAccountId());
            User receiverUser = userServiceImplementation.findFirstByUserId(account.getUserId());
            TransactionsPrintRequest transactionsPrintRequest = new TransactionsPrintRequest(
                    transaction.getDate(),
                    accountServiceImplementation.findFirstByAccountId(transaction.getSenderAccountId()).getAccountType(),
                    accountServiceImplementation.findFirstByAccountId(transaction.getSenderAccountId()).getAccountNr(),
                    receiverUser.getFirstName() + " " + receiverUser.getLastName(),
                    accountServiceImplementation.findFirstByAccountId(transaction.getReceiverAccountId()).getAccountType(),
                    accountServiceImplementation.findFirstByAccountId(transaction.getReceiverAccountId()).getAccountNr(),
                    -transaction.getAmount()
            );
            transactionsPrintRequests.add(transactionsPrintRequest);
        }
//        System.out.println("Lista Tranzactii:\n\n\n\n" + transactionsPrintRequests + "\n\n\n");

        return  transactionsPrintRequests;
    }

    @Override
    public ResponseEntity Insert(TransactionCreateRequest transactionCreateRequest) {
        List<Account> accounts = (List<Account>) accountServiceImplementation.getAll();
        Account senderAcc = accountServiceImplementation.findFirstByAccountId(transactionCreateRequest.getSenderAccountId());
        Account receiverAcc = accountServiceImplementation.findFirstByAccountId(transactionCreateRequest.getReceiverAccountId());



        if(senderAcc.getBalance() >= transactionCreateRequest.getAmount()) {
            senderAcc.setBalance(senderAcc.getBalance() - transactionCreateRequest.getAmount());
            accountServiceImplementation.Update(senderAcc);

            receiverAcc.setBalance(receiverAcc.getBalance() + transactionCreateRequest.getAmount());
            accountServiceImplementation.Update(receiverAcc);

            LocalDate currentDate = LocalDate.now();
            Transaction transaction = new Transaction(
                    transactionCreateRequest.getSenderAccountId(),
                    transactionCreateRequest.getReceiverAccountId(),
                    transactionCreateRequest.getAmount(),
                    currentDate
            );

            transactionRepository.save(transaction);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Not enough money");
        }

        return ResponseEntity.status(HttpStatus.OK).body("Transaction completed!");
    }

    @Override
    public void Update(Transaction transaction) {
        Transaction transaction1 = transactionRepository.findFirstByTransactionId(transaction.getTransactionId());

        if(transaction1 != null) {
            Account senderAcc = accountServiceImplementation.findFirstByAccountId(transaction1.getSenderAccountId());
            Account receiverAcc = accountServiceImplementation.findFirstByAccountId(transaction1.getReceiverAccountId());
            senderAcc.setBalance(senderAcc.getBalance() + transaction1.getAmount());
            receiverAcc.setBalance(receiverAcc.getBalance() - transaction1.getAmount());
            accountServiceImplementation.Update(senderAcc);
            accountServiceImplementation.Update(receiverAcc);

            senderAcc = accountServiceImplementation.findFirstByAccountId(transaction.getSenderAccountId());
            receiverAcc = accountServiceImplementation.findFirstByAccountId(transaction.getReceiverAccountId());
            senderAcc.setBalance(senderAcc.getBalance() - transaction.getAmount());
            receiverAcc.setBalance(receiverAcc.getBalance() + transaction.getAmount());
            accountServiceImplementation.Update(senderAcc);
            accountServiceImplementation.Update(receiverAcc);

            transaction.setDate(transaction1.getDate());

            transactionRepository.save(transaction);
        }
    }

    @Transactional
    @Override
    public void DeleteById(Long id) {
        System.out.println("IDDDDDDDD: " + id);
        Transaction transaction1 = transactionRepository.findFirstByTransactionId(id);

        if(transaction1 != null) {
            Account senderAcc = accountServiceImplementation.findFirstByAccountId(transaction1.getSenderAccountId());
            Account receiverAcc = accountServiceImplementation.findFirstByAccountId(transaction1.getReceiverAccountId());
            senderAcc.setBalance(senderAcc.getBalance() + transaction1.getAmount());
            receiverAcc.setBalance(receiverAcc.getBalance() - transaction1.getAmount());
            accountServiceImplementation.Update(senderAcc);
            accountServiceImplementation.Update(receiverAcc);

            transactionRepository.deleteById(id);
        }
    }
}
