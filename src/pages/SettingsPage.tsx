import { Button, Collapse } from '@mui/material';
import Paper from '@mui/material/Paper';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TimeTable from '../components/TimeTable/TimeTable';
import { PagesUrl } from '../interfaces/pages.meta';
import { loginService } from '../services/loginService';

export const SettingsPage = observer(() => {

    const navigate = useNavigate();

    const doSignout = async () => {
        await loginService.doSignout();
        navigate(PagesUrl.Login);
    }

    return (
        <Paper sx={{ margin: 'auto', overflow: 'hidden', height: '100%' }}>
            <div style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ width: "280px" }}>
                    <div style={{ justifyContent: 'center', display: 'flex' }}>Warning: This action is irreversible</div>
                    <div>
                        <Button
                            variant="contained"
                            color="error"
                            style={{ height: "50px", width: "280px", justifyContent: 'center', marginTop: '10px'  }}
                            onClick={() => doSignout()}
                        >
                            Delete the company
                        </Button>
                        {/* need to send to the manager the whole json config if he make a mistake */}
                    </div>
                </div>
            </div>
        </Paper>
    );
});
