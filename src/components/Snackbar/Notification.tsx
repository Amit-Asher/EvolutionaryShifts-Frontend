import { IconButton, Snackbar } from "@mui/material";
import { observer } from "mobx-react";
import { globalStore } from "../../stores/globalStore";
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import React from "react";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SnackBarNotification() {

    const action = (
        <>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={(e) => globalStore.notificationStore.hide()}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      );

    return (
        <Snackbar
            open={globalStore.notificationStore.isOpen}
            onClose={(e) => globalStore.notificationStore.hide()}
            action={action}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            autoHideDuration={2000}
        >
            <Alert
                onClose={(e) => globalStore.notificationStore.hide()} 
                severity={globalStore.notificationStore.severity} 
                sx={{ width: '100%' }}>
                {globalStore.notificationStore.message}
            </Alert>
        </Snackbar>
    );
}

export const Notification = observer(SnackBarNotification);