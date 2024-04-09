import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MainListItemsAdmin from './listItemsAdmin';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useNavigate } from 'react-router-dom';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Radio from '@mui/material/Radio';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const defaultTheme = createTheme();

export default function TransactionsAdmin() {
    const navigate = useNavigate();
    const location = useLocation();
    const userId = parseInt(location.state?.key, 10);
    const [userData, setUserData] = React.useState({ firstName: '', lastName: '' });
    const [open, setOpen] = React.useState(false);
    const [userAccounts, setUserAccounts] = React.useState([]);
    const [otherUsers, setOtherUsers] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [transactionAmount, setTransactionAmount] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [editAccountData, setEditAccountData] = useState({fromId: '', toId: '', balance: ''});
    const [allAccounts, setAllAccounts] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const [openSuccess, setOpenSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchTransactions = () => {
        axios.get('http://localhost:8080/transactions/GetAllTransactions', {
            headers: {
                "content-type": "application/json"
            }
        }).then(response => {
            console.log(response.data);
            setTransactions(response.data);
        }).catch(error => console.error('Error fetching transactions:', error));
    };

    useEffect(() => {
        axios.get('http://localhost:8080/accounts/GetAll', {
            headers: {
                "content-type": "application/json"
            }
        }).then(response => {
            console.log(response.data);
            setAllAccounts(response.data);
        }).catch(error => console.error('Error fetching accounts:', error));

        fetchTransactions();
    }, [userId]);

    const handleTransactionSelection = (transaction) => {
        setSelectedTransaction(transaction);
        setEditAccountData({
            fromId: transaction.senderAccountId,
            toId: transaction.receiverAccountId,
            balance: transaction.amount
        });
    };

    const handleDeleteTransactions = (transactionId) => {
        console.log(transactionId);
        axios.post(`http://localhost:8080/transactions/DeleteById`, transactionId, {
            headers: {
                "content-type": "application/json"
            }
        }).then(response => {
            console.log('Transaction deleted:', response.data);
            fetchTransactions();
            setSuccessMessage('Transaction deleted successfully!');
            setOpenSuccess(true);
        }).catch(error => {
            console.error('Error deleting transaction:', error);
            setErrorMessage('Failed to delete transaction. Please try again.');
            setOpenError(true);
        });
    };

    const handleEditTransactionChange = (event) => {
        setEditAccountData({
            ...editAccountData,
            [event.target.name]: event.target.value
        });
    };


    const handleUpdateTransactionSubmit = (event) => {
        event.preventDefault();

        if (!editAccountData.fromId || !editAccountData.toId || editAccountData.balance === '') {
            setErrorMessage('All fields are required to update the transaction.');
            setOpenError(true);
            return;
        }

        const updatedTransaction = {
            transactionId: selectedTransaction.transactionId,
            senderAccountId: editAccountData.fromId,
            receiverAccountId: editAccountData.toId,
            amount: parseFloat(editAccountData.balance)
        };

        axios.post(`http://localhost:8080/transactions/Update`, updatedTransaction, {
            headers: {
                "content-type": "application/json"
            }
        }).then(response => {
            console.log('Transaction updated:', response.data);
            fetchTransactions();
            setSuccessMessage('Transaction updated successfully!');
            setOpenSuccess(true);
        }).catch(error => {
            console.error('Error updating transaction:', error);
            setErrorMessage('Failed to update transaction. Please try again.');
            setOpenError(true);
        });
    };


    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleSignOut = () => {
        navigate('../sign-in', { replace: true });
    };

    const handleCloseSuccess = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false);
    };

    const handleCloseError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenError(false);
    };

    const handleRadioChange = (accountId) => {
        setSelectedAccountId(accountId);
    };

    const handleTransactionAmountChange = (event) => {
        setTransactionAmount(event.target.value);
    };

    const handleTransaction = () => {
        if (selectedAccountId && selectedAccount && transactionAmount) {
            const transactionData = {
                senderAccountId: selectedAccountId,
                receiverAccountId: selectedAccount,
                amount: parseFloat(transactionAmount)
            };

            axios.post('http://localhost:8080/transactions/Insert', transactionData, {
                headers: {
                    "content-type": "application/json"
                }
            }).then(response => {
                console.log(response.data);
                fetchTransactions();
                setOpenSuccess(true);
                setSuccessMessage('Transaction successful');
            }).catch(error => {
                console.error('Error processing transaction:', error);
                setOpenError(true);
                setErrorMessage('Transaction failed');
            });

            setTransactionAmount('');
        } else {
            setErrorMessage('Please select accounts and specify an amount');
            setOpenError(true);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const formatAccountDisplay = (accountNumber, accountType) => {
        const lastFourDigits = accountNumber.toString().slice(-4);
        return `${accountType} •••• ${lastFourDigits}`;
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px',
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h5"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            Transactions
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            px: [1],
                            height: '100%',
                        }}
                    >
                        <IconButton onClick={toggleDrawer} sx={{ marginLeft: 'auto' }}>
                            <ChevronLeftIcon />
                        </IconButton>
                        <Divider sx={{ my: 1 }} />
                        <List component="nav" sx={{ width: '100%', marginBottom: 'auto' }}>
                            <MainListItemsAdmin/>
                        </List>
                        <Divider />
                        <List component="nav" sx={{ width: '100%' }}>
                            <ListItem button onClick={handleSignOut}>
                                <ListItemIcon>
                                    <ExitToAppIcon />
                                </ListItemIcon>
                                <ListItemText primary="Sign Out" />
                            </ListItem>
                        </List>
                    </Toolbar>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Container maxWidth="lg" sx={{ mt: 12, mb: 12 }}>
                        <Grid container spacing={2} direction="column" alignItems="center">
                            {/* Display all transactions accounts */}
                            <Grid item xs={12}>
                                {/* Display all transactions */}
                                <Paper sx={{ p: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Transactions:
                                    </Typography>
                                    <TableContainer component={Paper} style={{ maxHeight: '250px' }}>
                                        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="transactions table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell padding="checkbox"></TableCell>
                                                    <TableCell>Nr.</TableCell>
                                                    <TableCell align="left">Date</TableCell>
                                                    <TableCell align="left">From</TableCell>
                                                    <TableCell align="left">To</TableCell>
                                                    <TableCell align="left">Amount</TableCell>
                                                    <TableCell></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {transactions.map((transaction, index) => (
                                                    <TableRow
                                                        key={transaction.transactionId}
                                                        onClick={() => handleTransactionSelection(transaction)} // Set onClick for row
                                                    >
                                                    <TableCell padding="checkbox">
                                                            <Radio
                                                                checked={selectedAccountId === transaction.transactionId}
                                                                onChange={() => handleRadioChange(transaction.transactionId)}
                                                            />
                                                        </TableCell>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{formatDate(transaction.date)}</TableCell>
                                                        <TableCell>{transaction.senderAccountId}</TableCell>
                                                        <TableCell>{transaction.receiverAccountId}</TableCell>
                                                        <TableCell>{transaction.amount.toFixed(2)}</TableCell>
                                                        <TableCell align="left">
                                                            <IconButton
                                                                onClick={() => handleDeleteTransactions(transaction.transactionId)}
                                                                aria-label="delete"
                                                            >
                                                                <DeleteForeverIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Grid>

                            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    {/* Edit a transaction */}
                                    <Grid item xs={12} md={6}>
                                        <Paper sx={{p: 3}}>
                                            <Typography variant="h6" gutterBottom>
                                                Edit Transaction:
                                            </Typography>
                                            <form onSubmit={handleUpdateTransactionSubmit}>
                                                {/* FromID Type Dropdown */}
                                                <FormControl fullWidth margin="normal">
                                                    <InputLabel id="fromID-label">From Account</InputLabel>
                                                    <Select
                                                        labelId="fromID-label"
                                                        id="fromID"
                                                        name="fromId"
                                                        value={editAccountData.senderAccountId}
                                                        label="From Account"
                                                        onChange={handleEditTransactionChange}
                                                    >
                                                        {allAccounts
                                                            .filter(account => account.accountId !== editAccountData.receiverAccountId) // Filter out the receiver account
                                                            .map((account) => (
                                                                <MenuItem key={account.accountId} value={account.accountId}>
                                                                    {account.accountId}
                                                                </MenuItem>
                                                            ))}
                                                    </Select>
                                                </FormControl>
                                                {/* To Account ID Dropdown */}
                                                <FormControl fullWidth margin="normal">
                                                    <InputLabel id="toID-label">To Account</InputLabel>
                                                    <Select
                                                        labelId="toID-label"
                                                        id="toID"
                                                        name="toId"
                                                        value={editAccountData.receiverAccountId}
                                                        label="To Account"
                                                        onChange={handleEditTransactionChange}
                                                    >
                                                        {allAccounts
                                                            .filter(account => account.accountId !== editAccountData.senderAccountId) // Filter out the sender account
                                                            .map((account) => (
                                                                <MenuItem key={account.accountId} value={account.accountId}>
                                                                    {account.accountId}
                                                                </MenuItem>
                                                            ))}
                                                    </Select>
                                                </FormControl>
                                                {/* Amount Input */}
                                                <TextField
                                                    required
                                                    id="amount"
                                                    name="balance"
                                                    label="Amount"
                                                    fullWidth
                                                    margin="normal"
                                                    type="number"
                                                    value={editAccountData.balance}
                                                    onChange={handleEditTransactionChange}
                                                />
                                                <Box sx={{display: 'flex', justifyContent: 'center', mt: 3, mb: 2}}>
                                                    <Button type="submit" variant="contained">
                                                        Edit Transaction
                                                    </Button>
                                                </Box>
                                            </form>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Container>
                        </Grid>
                    </Container>
                </Box>
            </Box>
            <Snackbar open={openSuccess} autoHideDuration={1000} onClose={handleCloseSuccess}>
                <MuiAlert elevation={6} variant="filled" onClose={handleCloseSuccess} severity="success">
                    {successMessage}
                </MuiAlert>
            </Snackbar>
            <Snackbar open={openError} autoHideDuration={2000} onClose={handleCloseError}>
                <MuiAlert elevation={6} variant="filled" onClose={handleCloseError} severity="error">
                    {errorMessage}
                </MuiAlert>
            </Snackbar>
        </ThemeProvider>
    );
}