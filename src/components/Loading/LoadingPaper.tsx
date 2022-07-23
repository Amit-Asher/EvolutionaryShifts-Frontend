import { Box, CircularProgress, Paper } from "@mui/material";

export const LoadingPaper = () => {
  return (
    <Paper
      sx={{ margin: "auto", overflow: "hidden" }}
      style={{
        height: "100%",
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    </Paper>
  );
};
