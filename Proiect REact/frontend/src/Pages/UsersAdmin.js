import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Box, Container, Grid, Paper, Typography, TextField, Button, CssBaseline, Toolbar, IconButton, List, Divider, ListItem, ListItemIcon, ListItemText, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import {createTheme, styled, ThemeProvider} from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MainListItemsAdmin from './listItemsAdmin';
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

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

export default function UsersAdmin() {
    const navigate = useNavigate();
    const location = useLocation();
    const userId = parseInt(location.state?.key, 10);
    const [userData, setUserData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
    const [open, setOpen] = useState(false);
    const [otherUsers, setOtherUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');

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

    useEffect(() => {
        fetchOtherUsers();

        if (selectedUser) {
            axios.post('http://localhost:8080/users/GetById', selectedUser, {
                headers: {
                    "content-type": "application/json"
                }
            })
            .then(response => {
                setUserData({
                    firstName: response.data.firstName || '',
                    lastName: response.data.lastName || '',
                    email: response.data.email || '',
                    phone: response.data.phone || '',
                    password: response.data.password || '1234', // Be cautious with password fields
                });
            })
            .catch(error => console.error('Error fetching user details:', error));
        }
    }, [selectedUser]);


    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleSignOut = () => {
        navigate('../sign-in', { replace: true });
    };

    const handleUserChange = (event) => {
        setSelectedUser(event.target.value);
    };

    const handleInputChange = (event) => {
        setUserData({ ...userData, [event.target.name]: event.target.value });
    };

    const handleProfileSubmit = (event) => {
        event.preventDefault();

        const isAnyFieldEmpty = Object.values(userData).some(field => field.trim() === '');

        if (isAnyFieldEmpty) {
            setErrorMessage('Please fill in all fields.');
            setOpenError(true);
            return;
        }

        axios.post('http://localhost:8080/users/Update', {
            id: selectedUser,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            password: userData.password,
        }, {
            headers: {
                "content-type": "application/json"
            }
        }).then(response => {
            console.log(response.data);
            setSuccessMessage('Profile updated successfully!');
            setOpenSuccess(true);
        }).catch(error => {
            console.error('Error updating profile:', error);
            setErrorMessage('Failed to update profile. Please try again.');
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

    const handleDeleteUser = async () => {
        console.log(selectedUser);
        if (!selectedUser) {
            setErrorMessage('No user selected.');
            setOpenError(true);
            return;
        }

        try {
            await axios.post('http://localhost:8080/transactions/DeleteTransactionsByUserId', selectedUser, {
                headers: { "content-type": "application/json" }
            });
            await axios.post('http://localhost:8080/users/DeleteById', selectedUser, {
                headers: { "content-type": "application/json" }
            });
            await axios.post('http://localhost:8080/accounts/DeleteAccountsByUserId', selectedUser, {
                headers: { "content-type": "application/json" }
            });

            setSuccessMessage('User and related data deleted successfully!');
            setOpenSuccess(true);
            fetchOtherUsers();
            setUserData({ firstName: '', lastName: '', email: '', phone: '', password: '' });
            setSelectedUser('');
        } catch (error) {
            console.error('Error deleting user:', error);
            setErrorMessage('Failed to delete user. Please try again.');
            setOpenError(true);
        }
        setUserData({ firstName: '', lastName: '', email: '', phone: '', password: '' });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        try {
            const signUpData = {
                firstName: data.get('firstName'),
                lastName: data.get('lastName'),
                email: data.get('email'),
                phone: data.get('phone'),
                password: data.get('password')
            };

            const response = await axios.post('http://localhost:8080/users/SignUp', signUpData, {
                headers: {
                    "content-type": "application/json"
                }
            });

            if (response.status === 200) {
                setSuccessMessage('User created successfully!');
                setOpenSuccess(true);
                fetchOtherUsers();
                setUserData({ firstName: '', lastName: '', email: '', phone: '', password: '' });
                setSelectedUser('');
            }
        } catch (error) {
            console.error('Error creating user', error);
            setOpenError(true);
            setErrorMessage('Creation of user failed');
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
                            Users
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
                    <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
                        <Grid container spacing={3} direction="column" alignItems="center" justifyContent="flex-end">
                            <Grid item xs={12} md={6}>
                                {/* New User Details Section */}
                                <Paper sx={{ p: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        New User
                                    </Typography>
                                    <form onSubmit={handleSubmit}>
                                        {/* First Name */}
                                        <TextField
                                            required
                                            id="firstName"
                                            name="firstName"
                                            label="First Name"
                                            fullWidth
                                            autoComplete="given-name"
                                            margin="normal"
                                        />
                                        {/* Last Name */}
                                        <TextField
                                            required
                                            id="lastName"
                                            name="lastName"
                                            label="Last Name"
                                            fullWidth
                                            autoComplete="family-name"
                                            margin="normal"
                                        />
                                        {/* Email */}
                                        <TextField
                                            required
                                            id="email"
                                            name="email"
                                            label="Email"
                                            fullWidth
                                            autoComplete="email"
                                            margin="normal"
                                        />
                                        {/* Phone */}
                                        <TextField
                                            required
                                            id="phone"
                                            name="phone"
                                            label="Phone"
                                            fullWidth
                                            autoComplete="tel"
                                            margin="normal"
                                        />
                                        {/* Password */}
                                        <TextField
                                            required
                                            id="password"
                                            name="password"
                                            label="Password"
                                            fullWidth
                                            autoComplete="password"
                                            margin="normal"
                                        />
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
                                            <Button type="submit" variant="contained">
                                                Create User
                                            </Button>
                                        </Box>
                                    </form>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                {/* Existig User Details Section */}
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

                                {/* Edit User Details Section */}
                                <Paper sx={{ p: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Edit User Profile
                                    </Typography>
                                    <form onSubmit={handleProfileSubmit}>
                                        {/* First Name */}
                                        <TextField
                                            required
                                            id="firstName"
                                            name="firstName"
                                            label="First Name"
                                            fullWidth
                                            autoComplete="given-name"
                                            margin="normal"
                                            value={userData.firstName}
                                            onChange={handleInputChange}
                                        />
                                        {/* Last Name */}
                                        <TextField
                                            required
                                            id="lastName"
                                            name="lastName"
                                            label="Last Name"
                                            fullWidth
                                            autoComplete="family-name"
                                            margin="normal"
                                            value={userData.lastName}
                                            onChange={handleInputChange}
                                        />
                                        {/* Email */}
                                        <TextField
                                            required
                                            id="email"
                                            name="email"
                                            label="Email"
                                            fullWidth
                                            autoComplete="email"
                                            margin="normal"
                                            value={userData.email}
                                            onChange={handleInputChange}
                                        />
                                        {/* Phone */}
                                        <TextField
                                            required
                                            id="phone"
                                            name="phone"
                                            label="Phone"
                                            fullWidth
                                            autoComplete="tel"
                                            margin="normal"
                                            value={userData.phone}
                                            onChange={handleInputChange}
                                        />
                                        {/* Password */}
                                        <TextField
                                            required
                                            id="password"
                                            name="password"
                                            label="Password"
                                            fullWidth
                                            autoComplete="password"
                                            margin="normal"
                                            value={userData.password}
                                            onChange={handleInputChange}
                                        />
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
                                            <Button type="submit" variant="contained">
                                                Save User
                                            </Button>
                                        </Box>
                                    </form>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
                                        <Button onClick={handleDeleteUser} variant="contained">
                                            Delete User
                                        </Button>
                                    </Box>
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
