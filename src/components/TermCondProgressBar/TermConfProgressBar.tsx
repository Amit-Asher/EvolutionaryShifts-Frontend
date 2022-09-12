import { Box, CircularProgress, LinearProgress, Paper, Typography, styled, LinearProgressProps } from "@mui/material";
import PropTypes from "prop-types";

const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

export interface TermCondProgressBarProps {
    title: string;
    map: Map<string, number>;
}

const LinearProgressWithLabel = (props: any) => {
    return (
        <Box display="flex" alignItems="center" p={3}>
            <Box width="100%" mr={3}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(
                    props.value
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired
};

export const TermCondProgressBar = (props: TermCondProgressBarProps) => {

    return (<>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '15%' }}>
                <Label>{props.title}</Label>
            </div>
            <div style={{ width: '85%' }}>
                <LinearProgressWithLabel value={props.map.get(props.title) || 0} />
            </div>
        </div>
    </>
    );
};
