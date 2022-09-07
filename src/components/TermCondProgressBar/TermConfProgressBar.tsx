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
        <div>
            <Label>{props.title}</Label>
            <LinearProgressWithLabel value={props.map.get(props.title) || 0}/>
        </div>
        </>
      );












    // return (<>
    //     <div>
    //         <Label>{props.title}</Label>
    //         <div style={{ width: "100%" }}>
    //             <Box display="flex" alignItems="center" p={3}>
    //                 <Box width="100%" mr={3}>
    //                     <LinearProgress variant="determinate" {...props} />
    //                 </Box>
    //                 <Box minWidth={35}>
    //                     <Typography variant="body2" color="textSecondary">{`${Math.round(props.bygen)}%`}</Typography>
    //                 </Box>
    //             </Box>
    //         </div>
    //     </div>
    // </>
    // );
};
