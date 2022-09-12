import { Box, CircularProgress, Paper } from "@mui/material";
import { ReactComponent as ActiveIcon } from '../../themes/check.svg';
import { ReactComponent as PendingIcon } from '../../themes/pending.svg';

export interface StatusBarProps {
    title: string;
    isActive: boolean;

    key: string;
}

export const StatusBar = (props: StatusBarProps) => {
    return (
        <div key={props.key} style={{ padding: '10px', display: 'flex' }}>
            {props.isActive ?
                <ActiveIcon style={{ width: '20px', height: '20px', marginRight: '10px' }} /> :
                <PendingIcon style={{ width: '20px', height: '20px', marginRight: '10px' }} />
            }
            <div>{props.title}</div>
        </div>
    );
};
