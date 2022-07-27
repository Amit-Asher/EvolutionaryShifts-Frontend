import { IconButton, Snackbar } from "@mui/material";
import { observer } from "mobx-react";
import { globalStore } from "../../stores/globalStore";
import CloseIcon from '@mui/icons-material/Close';

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
        message={globalStore.notificationStore.message}
        action={action}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    );
}

export const Notification = observer(SnackBarNotification);