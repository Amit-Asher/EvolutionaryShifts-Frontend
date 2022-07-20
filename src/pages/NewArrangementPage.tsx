import {
  Box,
  Button,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import react from "react";

// functional component
function NewArrangementPage() {
  return (
    <>
      <div style={{ width: "10%", height: "90%" }}>NewArrangementPage</div>
      <div style={{ width: "100%", display: "flex" }}>
        <div style={{ width: "90%" }}></div>
        <div style={{ width: "10%" }}>
          <Button>Click Me</Button>
        </div>
      </div>
    </>
  );
}

export default NewArrangementPage;
