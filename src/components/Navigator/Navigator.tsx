import { Box } from "@mui/material";
import NavigatorMui from "./NavigatorMui";

const drawerWidth = 256;

export const Navigator = () => {
  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <NavigatorMui
        PaperProps={{ style: { width: drawerWidth } }}
        sx={{ display: { sm: "block", xs: "none" } }}
      />
    </Box>
  );
};
