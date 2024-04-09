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
import {useEffect, useState} from "react";
import axios from "axios";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {Button, ListItem, TextField} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Radio from "@mui/material/Radio";

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

export default function AccountsAdmin() {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [userAccounts, setUserAccounts] = React.useState([]);
    const [newAccountData, setNewAccountData] = useState({ accountType: '', balance: '' });
    const [otherUsers, setOtherUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [editAccountData, setEditAccountData] = useState({ accountType: '', balance: '' });

    const [openSuccess, setOpenSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchOtherUsers = () => {
        axios.post('http://localhost:8080/users/GetOtherUsers', 1, {
            headers: {
                "content-type": "application/json"
            }
        }).then(response => {
            setOtherUsers(response.data);
        }).catch(error => console.error('Error fetching other users:', error));
    };

    const fetchAccounts = () => {
        if (selectedUser) {
            axios.post(`http://localhost:8080/accounts/GetAccountsByUserId`, selectedUser, {
                headers: {
                    "content-type": "application/json"
                }
            }).then(response => {
                setUserAccounts(response.data);
            }).catch(error => console.error('Error fetching accounts:', error));
        }
    };

    useEffect(() => {
        fetchOtherUsers();
        fetchAccounts();
    }, [selectedUser]);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleSignOut = () => {
        navigate('../sign-in', { replace: true });
    };

    const handleNewAccountChange = (event) => {
        setNewAccountData({ ...newAccountData, [event.target.name]: event.target.value });
    };

    const handleCreateAccountSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8080/accounts/CreateAccount', {
            userId: selectedUser,
            accountType: newAccountData.accountType,
            balance: parseFloat(newAccountData.balance)
        }, {
            headers: {
                "content-type": "application/json"
            }
        }).then(response => {
            console.log('Account created:', response.data);
            fetchAccounts();
            setSuccessMessage('New account created successfully!');
            setOpenSuccess(true);
            setNewAccountData({ accountType: '', balance: '' });
        }).catch(error => {
            console.error('Error creating account:', error);
            setErrorMessage('Failed to create a new account. Please try again.');
            setOpenError(true);
        });
    };

    const handleEditAccountChange = (event) => {
        setEditAccountData({ ...editAccountData, [event.target.name]: event.target.value });
    };

    const handleUpdateAccountSubmit = (event) => {
        event.preventDefault();

        if (!editAccountData.accountType || editAccountData.balance === '') {
            setErrorMessage('All fields are required to update the account.');
            setOpenError(true);
            return; // Prevent form submission
        }

        if (!selectedUser || !selectedAccountId) {
            setErrorMessage('Please select a user and an account to update.');
            setOpenError(true);
            return;
        }

        const accountToUpdate = userAccounts.find(acc => acc.accountId === selectedAccountId);
        if (!accountToUpdate) {
            console.error('Error: Account not found');
            setErrorMessage('Error: Account not found. Please try again.');
            setOpenError(true);
            return;
        }

        axios.post('http://localhost:8080/accounts/Update', {
            accountId: selectedAccountId,
            userId: selectedUser,
            accountType: editAccountData.accountType,
            balance: parseFloat(editAccountData.balance),
            accountNr: userAccounts.find(acc => acc.accountId === selectedAccountId).accountNr
        }, {
            headers: {
                "content-type": "application/json"
            }
        }).then(response => {
            console.log('Account updated:', response.data);
            fetchAccounts();
            setSuccessMessage('Account updated successfully!');
            setOpenSuccess(true);
            setEditAccountData({ accountType: '', balance: '' });
        }).catch(error => {
            console.error('Error updating account:', error);
            setErrorMessage('Failed to update the account. Please try again.');
            setOpenError(true);
        });
    };

    const handleDeleteAccount = (accountId) => {
        axios.post(`http://localhost:8080/transactions/DeleteByAccountId`, accountId, {
            headers: {
                "content-type": "application/json"
            }
        }).then(response => {
            console.log('Trasactions deleted:', response.data);
        }).catch(error => {
            console.error('Error deleting transactions:', error);
        });

        axios.post(`http://localhost:8080/accounts/DeleteById`, accountId, {
            headers: {
                "content-type": "application/json"
            }
        }).then(response => {
            console.log('Account deleted:', response.data);
            fetchAccounts();
            setSuccessMessage('Account deleted successfully!');
            setOpenSuccess(true);
        }).catch(error => {
            console.error('Error deleting account:', error);
            setErrorMessage('Failed to delete account. Please try again.');
            setOpenError(true);
        });
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

    const handleRadioChange = (accountId) => {
        setSelectedAccountId(accountId);
        const accountToEdit = userAccounts.find(account => account.accountId === accountId);
        if (accountToEdit) {
            setEditAccountData({ accountType: accountToEdit.accountType, balance: accountToEdit.balance });
        }
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
                            Users Accounts
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
                        paddingTop: '64px',
                    }}
                >
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={2} direction="column" alignItems="center">
                            {/* Display the user accounts */}
                            <Grid item xs={12}>
                                {/* Users Drop Down Section */}
                                <Paper sx={{ p: 3 }}>
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
                                </Paper>

                                <Paper sx={{ p: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        User Accounts:
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
                                                    <TableCell></TableCell>
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
                                                        <TableCell align="right">
                                                            <IconButton
                                                                onClick={() => handleDeleteAccount(account.accountId)}
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
                                    {/* Edit an account */}
                                    <Grid item xs={12} md={6}>
                                        <Paper sx={{p: 3}}>
                                            <Typography variant="h6" gutterBottom>
                                                Edit Account:
                                            </Typography>
                                            <form onSubmit={handleUpdateAccountSubmit}>
                                                {/* Account Type Dropdown */}
                                                <FormControl fullWidth margin="normal">
                                                    <InputLabel id="account-type-label1">Account Type</InputLabel>
                                                    <Select
                                                        labelId="account-type-label1"
                                                        id="accountType1"
                                                        name="accountType"
                                                        value={editAccountData.accountType}
                                                        label="Account Type"
                                                        onChange={handleEditAccountChange}
                                                    >
                                                        <MenuItem value="VISA">VISA</MenuItem>
                                                        <MenuItem value="MASTERCARD">MASTERCARD</MenuItem>
                                                        <MenuItem value="AMERICAN EXPRESS">AMERICAN EXPRESS</MenuItem>
                                                        <MenuItem value="DISCOVER">DISCOVER</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                {/* Balance Input */}
                                                <TextField
                                                    required
                                                    id="balance1"
                                                    name="balance"
                                                    label="Balance"
                                                    fullWidth
                                                    margin="normal"
                                                    type="number"
                                                    value={editAccountData.balance}
                                                    onChange={handleEditAccountChange}
                                                />
                                                <Box sx={{display: 'flex', justifyContent: 'center', mt: 3, mb: 2}}>
                                                    <Button type="submit" variant="contained">
                                                        Edit Account
                                                    </Button>
                                                </Box>
                                            </form>

                                            <Typography variant="h6" gutterBottom>
                                                New Account:
                                            </Typography>
                                            <form onSubmit={handleCreateAccountSubmit}>
                                                {/* Account Type Dropdown */}
                                                <FormControl fullWidth margin="normal">
                                                    <InputLabel id="account-type-label">Account Type</InputLabel>
                                                    <Select
                                                        labelId="account-type-label"
                                                        id="accountType"
                                                        name="accountType"
                                                        value={newAccountData.accountType}
                                                        label="Account Type"
                                                        onChange={handleNewAccountChange}
                                                    >
                                                        <MenuItem value="VISA">VISA</MenuItem>
                                                        <MenuItem value="MASTERCARD">MASTERCARD</MenuItem>
                                                        <MenuItem value="AMERICAN EXPRESS">AMERICAN EXPRESS</MenuItem>
                                                        <MenuItem value="DISCOVER">DISCOVER</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                {/* Balance Input */}
                                                <TextField
                                                    required
                                                    id="balance"
                                                    name="balance"
                                                    label="Balance"
                                                    fullWidth
                                                    margin="normal"
                                                    type="number"
                                                    value={newAccountData.balance}
                                                    onChange={handleNewAccountChange}
                                                />
                                                <Box sx={{display: 'flex', justifyContent: 'center', mt: 3, mb: 2}}>
                                                    <Button type="submit" variant="contained">
                                                        Add New Account
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