import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { OperationStatus } from '../interfaces/common';
import { loginService } from '../services/loginService';
import { useNavigate } from 'react-router-dom';
import { PagesUrl } from '../interfaces/pages.meta';

export const SignupPage = observer(() => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [signupStatus, setSignupStatus] = useState(OperationStatus.NONE);

    const onClickSignUp = async (event: any) => {
        event.preventDefault();

        try {
            await loginService.doSignup(
                email,
                password,
                firstName,
                lastName,
                companyName
            );
            setSignupStatus(OperationStatus.SUCCESS);
            navigate(PagesUrl.Arrangement); // BTW: we dont care if someone sneak in without token (=empty ui)
        } catch (err) {
            setSignupStatus(OperationStatus.FAILURE);
            console.log(`axios throws on 401 unauthorized! ${err}`);
        }
    };


    return (
        <Container maxWidth="xs" style={{ marginTop: '50px' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
                style={{ marginBottom: '15px' }}
            >

                {/* icon */}
                <img src={require('../themes/logo.png')} style={{ width: '150px' }} />

                {/* title */}
                <Typography
                    style={{ marginTop: '10px' }}
                    component="h1"
                    variant="h5">
                    Sign up
                </Typography>
            </Box>

            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(event) => setEmail(event.target.value)}
            />

            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
            />

            <TextField
                margin="normal"
                required
                fullWidth
                name="firstname"
                label="First name"
                type="firstname"
                id="firstname"
                autoComplete="current-firstname"
                onChange={(event) => setFirstName(event.target.value)}
            />

            <TextField
                margin="normal"
                required
                fullWidth
                name="lastName"
                label="Last name"
                type="lastName"
                id="lastName"
                autoComplete="current-lastName"
                onChange={(event) => setLastName(event.target.value)}
            />

            <TextField
                margin="normal"
                required
                fullWidth
                name="companyName"
                label="Company"
                type="companyName"
                id="companyName"
                autoComplete="current-companyName"
                onChange={(event) => setCompanyName(event.target.value)}
            />


            <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={onClickSignUp}
                style={{ backgroundColor: '#081627' }}
            >
                Sign Up
            </Button>


            <Typography color="text.secondary" align="center" sx={{ mt: 8, mb: 4 }} style={{ marginTop: '10px' }}>
                {signupStatus === OperationStatus.FAILURE && 'Sign up failed - please try again'}
                {signupStatus === OperationStatus.SUCCESS && 'Sign up successful'}
            </Typography>


            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Link to="/login">
                    Already have an account? Click here to login
                </Link>
            </div>

            <Typography color="text.secondary" align="center" sx={{ mt: 8, mb: 4 }} style={{ marginTop: '10px' }}>
                {'Evolutionary Shifts | MTA '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </Container>
    );
});
