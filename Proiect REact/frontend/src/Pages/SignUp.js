import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const defaultTheme = createTheme();

export default function SignUp() {
    const navigate = useNavigate();
    const [openSuccess, setOpenSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [errors, setErrors] = useState({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        phoneNumber: false
    });

    const validateForm = (data) => {
        let newErrors = {
            firstName: !data.get('firstName'),
            lastName: !data.get('lastName'),
            email: !data.get('email'),
            password: !data.get('password'),
            phoneNumber: !data.get('phoneNumber')
        };

        setErrors(newErrors);
        return Object.values(newErrors).every(field => field === false);
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        if (!validateForm(data)) {
            console.log('Please fill all fields.');
            return;
        }

        try {
            const signUpData = {
                firstName: data.get('firstName'),
                lastName: data.get('lastName'),
                email: data.get('email'),
                phone: data.get('phoneNumber'),
                password: data.get('password')
            };
            const response = await axios.post('http://localhost:8080/users/SignUp', signUpData);
            if (response.status === 200) {
                setSuccessMessage('Sign up successful!');
                setOpenSuccess(true);
                setTimeout(() => navigate('../sign-in'), 1000);
            }
        } catch (error) {
            console.log('Failed to sign up.');
        }
    };

    const handleCloseSuccess = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    error={errors.firstName}
                                    helperText={errors.firstName && "First Name is required"}
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    error={errors.lastName}
                                    helperText={errors.lastName && "Last Name is required"}
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={errors.email}
                                    helperText={errors.email && "Email is required"}
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={errors.password}
                                    helperText={errors.password && "Password is required"}
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={errors.phoneNumber}
                                    helperText={errors.phoneNumber && "Phone number is required"}
                                    required
                                    fullWidth
                                    name="phoneNumber"
                                    label="Phone Number"
                                    id="phoneNumber"
                                    autoComplete="new-password"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="../sign-in" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
            <Snackbar open={openSuccess} autoHideDuration={2000} onClose={handleCloseSuccess}>
                <MuiAlert elevation={6} variant="filled" onClose={handleCloseSuccess} severity="success">
                    {successMessage}
                </MuiAlert>
            </Snackbar>
        </ThemeProvider>
    );
}