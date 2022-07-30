import { Collapse } from '@mui/material';
import Paper from '@mui/material/Paper';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';

export const ComingSoonPage = observer(() => {
    const [animation, setAnimation] = useState(false);
    setTimeout(() => {
        setAnimation(true);
    }, 50);

    return (
        <Paper sx={{ margin: 'auto', overflow: 'hidden', height: '100%' }}>
            <div style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Collapse orientation="horizontal" in={animation}>
                    <img src={require('../themes/coming-soon.png')} alt="fireSpot" style={{ width: '600px' }} />
                </Collapse>
            </div>
        </Paper>
    );
});
