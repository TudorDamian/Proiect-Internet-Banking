import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Box, Container, Grid, Paper, Typography, TextField, Button, CssBaseline, Toolbar, IconButton, List, Divider, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {createTheme, styled, ThemeProvider} from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MainListItems from './listItems';
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

export default function Profile() {
    const navigate = useNavigate();
    const location = useLocation();
    const userId = parseInt(location.state?.key, 10);

    const [userData, setUserData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [open, setOpen] = useState(false);

    const [openSuccess, setOpenSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        axios.post(`http://localhost:8080/users/GetById`, userId, {
            headers: {
                "content-type": "application/json"
            }
        })
            .then(response => {
                setUserData({
                    firstName : response.data.firstName,
                    lastName : response.data.lastName,
                    email : response.data.email,
                    password : response.data.password,
                    phone : response.data.phone,
                });
            })
            .catch(error => console.error('Error fetching user details:', error));
    }, [userId]);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleSignOut = () => {
        navigate('../sign-in', { replace: true });
    };

    const handleInputChange = (event) => {
        setUserData({ ...userData, [event.target.name]: event.target.value });
    };

    const handlePasswordChange = (event) => {
        setPasswordData({ ...passwordData, [event.target.name]: event.target.value });
    };

    const handleProfileSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8080/users/EditProfile', {
            profileId: userId,
            profileFirstName: userData.firstName,
            profileLastName: userData.lastName,
            profilePhone: userData.phone
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

    const handleChangePasswordSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8080/users/ChangePassword', {
            userId: userId,
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
            confirmPassword: passwordData.confirmPassword
        }, {
            headers: {
                "content-type": "application/json"
            }
        }).then(response => {
            console.log('Password changed:', response.data);
            setSuccessMessage('Password changed successfully!');
            setOpenSuccess(true);
        }).catch(error => {
            console.error('Error changing password:', error);
            setErrorMessage('Failed to change password. Please try again.');
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
                            Profile
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
                        paddingTop: '64px',
                    }}
                >
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={3} direction="column" alignItems="center" justifyContent="flex-end">
                            {/* Edit User Details Section */}
                            <Grid item xs={12} md={6} lg={4}>
                                <Paper sx={{ p: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Edit Profile
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
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
                                            <Button type="submit" variant="contained">
                                                Save Changes
                                            </Button>
                                        </Box>
                                    </form>
                                </Paper>
                            </Grid>

                            {/* Change Password Section */}
                            <Grid item xs={12} md={6} lg={4}>
                                <Paper sx={{ p: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Change Password
                                    </Typography>
                                    <form onSubmit={handleChangePasswordSubmit}>
                                        {/* Current Password */}
                                        <TextField
                                            required
                                            id="currentPassword"
                                            name="currentPassword"
                                            label="Current Password"
                                            fullWidth
                                            margin="normal"
                                            type="password"
                                            onChange={handlePasswordChange}
                                        />
                                        {/* New Password */}
                                        <TextField
                                            required
                                            id="newPassword"
                                            name="newPassword"
                                            label="New Password"
                                            fullWidth
                                            margin="normal"
                                            type="password"
                                            onChange={handlePasswordChange}
                                        />
                                        {/* Confirm Password */}
                                        <TextField
                                            required
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            label="Confirm Password"
                                            fullWidth
                                            margin="normal"
                                            type="password"
                                            onChange={handlePasswordChange}
                                        />
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
                                            <Button type="submit" variant="contained">
                                                Change Password
                                            </Button>
                                        </Box>
                                    </form>
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
