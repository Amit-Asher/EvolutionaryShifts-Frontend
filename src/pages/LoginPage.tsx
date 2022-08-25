import { Avatar, Box, Button, Checkbox, Collapse, Container, FormControlLabel, TextField, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { OperationStatus } from '../interfaces/common';
import { loginService } from '../services/loginService';
import { useNavigate } from 'react-router-dom';
import { PagesUrl } from '../interfaces/pages.meta';

export const LoginPage = observer(() => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState(OperationStatus.NONE);

    const onClickDoLogin = async (event: any) => {
        event.preventDefault();

        try {
            await loginService.doLogin(
                email,
                password
            );
            setLoginStatus(OperationStatus.SUCCESS);
            navigate(PagesUrl.Arrangement); // BTW: we dont care if someone sneak in without token (=empty ui)
        } catch (err) {
            setLoginStatus(OperationStatus.FAILURE);
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
                    Evolutionary Shifts
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

            <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={onClickDoLogin}
                style={{ backgroundColor: '#081627' }}
            >
                Log in
            </Button>


            <Typography color="text.secondary" align="center" sx={{ mt: 8, mb: 4 }} style={{ marginTop: '10px' }}>
                {loginStatus === OperationStatus.FAILURE && 'log in failed - please try again'}
                {loginStatus === OperationStatus.SUCCESS && 'log in successful'}
            </Typography>


            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Link to="/signup">
                    Don't have an account? Sign Up
                </Link>
            </div>


            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Link to="/forgetpassword">
                    Forget your password?
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
