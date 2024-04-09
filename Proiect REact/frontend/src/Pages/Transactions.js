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
import MainListItems from './listItems';
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

export default function Transactions() {
    const navigate = useNavigate();
    const location = useLocation();
    const userId = parseInt(location.state?.key, 10);
    const [userData, setUserData] = React.useState({ firstName: '', lastName: '' });
    const [open, setOpen] = React.useState(false);
    const [userAccounts, setUserAccounts] = React.useState([]);
    const [otherUsers, setOtherUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedUserAccounts, setSelectedUserAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [transactionAmount, setTransactionAmount] = useState('');
    const [transactions, setTransactions] = useState([]);

    const [openSuccess, setOpenSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchAccounts = () => {
        axios.post(`http://localhost:8080/accounts/GetAccountsByUserId`, userId, {
            headers: {
                "content-type": "application/json"
            }
        }).then(response => {
            setUserAccounts(response.data);
        }).catch(error => console.error('Error fetching accounts:', error));
    };

    const fetchOtherUsers = () => {
        axios.post('http://localhost:8080/users/GetOtherUsers', userId, {
            headers: {
                "content-type": "application/json"
            }
        }).then(response => {
            setOtherUsers(response.data);
        }).catch(error => console.error('Error fetching other users:', error));
    };

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
        fetchAccounts();
        fetchOtherUsers();
        fetchTransactions();

        axios.post(`http://localhost:8080/users/GetById`, userId, {
            headers: {
                "content-type": "application/json"
            }
        }).then(response => {
            console.log(response);
            setUserData({
                firstName : response.data.firstName,
                lastName : response.data.lastName,
                email : response.data.email,
                password : response.data.password,
                phone : response.data.phone,
            });
        }).catch(error => console.error('Error fetching user details:', error));

    }, [userId]);

    useEffect(() => {
        if (selectedUser) {
            axios.post(`http://localhost:8080/accounts/GetAccountsByUserId`, selectedUser, {
                headers: {
                    "content-type": "application/json"
                }
            }).then(response => {
                setSelectedUserAccounts(response.data);
            }).catch(error => console.error('Error fetching accounts for selected user:', error));
        }
    }, [selectedUser]);

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

    const handleUserChange = (event) => {
        setSelectedUser(event.target.value);
    };

    const handleAccountChange = (event) => {
        setSelectedAccount(event.target.value);
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
                fetchAccounts();
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
                            <MainListItems userId={userId}/>
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
                            <Grid item xs={12}>
                                {/* Display the user transactions */}
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

                                {/* Display the user accounts */}
                                <Paper sx={{ p: 3, mt: 2  }}>
                                    <Typography variant="h6" gutterBottom>
                                        My Accounts:
                                    </Typography>
                                    <TableContainer component={Paper} style={{ maxHeight: '250px' }}>
                                        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="user accounts table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell padding="checkbox"></TableCell>
                                                    <TableCell>Nr.</TableCell>
                                                    <TableCell align="left">Account Type</TableCell>
                                                    <TableCell align="left">Account Number</TableCell>
                                                    <TableCell align="left">Balance</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {userAccounts.map((account, index) => (
                                                    <TableRow
                                                        key={account.accountId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell padding="checkbox">
                                                            <Radio
                                                                checked={selectedAccountId === account.accountId}
                                                                onChange={() => handleRadioChange(account.accountId)}
                                                            />
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell align="left">{account.accountType}</TableCell>
                                                        <TableCell align="left">{account.accountNr}</TableCell>
                                                        <TableCell align="left">{account.balance.toFixed(2)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>

                                <Paper sx={{ p: 3, mt: 2 }}>
                                    <Grid container spacing={1}>
                                        <Typography variant="h6" gutterBottom>
                                            Select User:
                                        </Typography>
                                        <FormControl fullWidth>
                                            <InputLabel id="other-users-label">User</InputLabel>
                                            <Select
                                                labelId="other-users-label"
                                                id="other-users-select"
                                                value={selectedUser}
                                                label="User"
                                                onChange={handleUserChange}
                                            >
                                                {otherUsers.map((user) => (
                                                    <MenuItem key={user.id} value={user.id}>
                                                        {user.firstName + ' ' + user.lastName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <Typography variant="h6" gutterBottom>
                                            Select Account:
                                        </Typography>
                                        <FormControl fullWidth>
                                            <InputLabel id="selected-user-accounts-label">Account</InputLabel>
                                            <Select
                                                labelId="selected-user-accounts-label"
                                                id="selected-user-accounts-select"
                                                value={selectedAccount}
                                                label="Account"
                                                onChange={handleAccountChange}
                                            >
                                                {selectedUserAccounts.map((account) => {
                                                    const lastFourDigits = account.accountNr.toString().slice(-4);
                                                    const displayText = `${account.accountType}     •••• ${lastFourDigits}`;

                                                    return (
                                                        <MenuItem key={account.accountId} value={account.accountId}>
                                                            {displayText}
                                                        </MenuItem>
                                                    );
                                                })}
                                            </Select>
                                        </FormControl>

                                        <Typography variant="h6" gutterBottom>
                                            Amount:
                                        </Typography>
                                        <FormControl fullWidth>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Amount"
                                                    variant="outlined"
                                                    value={transactionAmount}
                                                    onChange={handleTransactionAmountChange}
                                                    fullWidth
                                                />
                                            </Grid>
                                        </FormControl>

                                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleTransaction}
                                            >
                                                Process Transaction
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Paper>

                            </Grid>
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