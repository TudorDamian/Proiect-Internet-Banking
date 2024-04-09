import * as React from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from "react";

export default function Orders({ userId }) {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = () => {
    axios.post('http://localhost:8080/transactions/GetTransactionsByUserId', userId, {
      headers: {
        "content-type": "application/json"
      }
    }).then(response => {
      console.log(response.data);
      setTransactions(response.data);
    }).catch(error => console.error('Error fetching transactions:', error));
  };

  useEffect(() => {
    fetchTransactions();

  }, [userId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatAccountDisplay = (accountNumber, accountType) => {
    const lastFourDigits = accountNumber.toString().slice(-4);
    return `${accountType} •••• ${lastFourDigits}`;
  };

  return (
      <React.Fragment>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Transactions:
          </Typography>
          <TableContainer component={Paper} style={{ maxHeight: '250px' }}>
            <Table stickyHeader sx={{ minWidth: 650 }} aria-label="user accounts table">
              <TableHead>
                <TableRow>
                  <TableCell>Nr.</TableCell>
                  <TableCell align="left">Date</TableCell>
                  <TableCell align="left">From</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">To</TableCell>
                  <TableCell align="left">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>{formatAccountDisplay(transaction.senderAccount, transaction.senderAccountType)}</TableCell>
                      <TableCell>{transaction.receiverName}</TableCell>
                      <TableCell>{formatAccountDisplay(transaction.receiverAccount, transaction.receiverAccountType)}</TableCell>
                      <TableCell>{transaction.amount.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </React.Fragment>
  );
}
