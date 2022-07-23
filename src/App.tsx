import { LocalizationProvider } from "@mui/x-date-pickers";
import Portal from "./portal";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Notification } from "./components/Snackbar/Notification";
import { BrowserRouter, useLocation } from 'react-router-dom';

function App() {    
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <BrowserRouter>
        <div className="App">
          {/* TODO: ADD REGISTRATION PAGES */}
          <Portal />
        </div>
        <Notification />
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
