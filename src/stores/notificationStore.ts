import { AlertColor } from "@mui/material";
import { action, makeAutoObservable, observable } from "mobx"

interface NotificationParams {
    message: string;
    severity: AlertColor;
}

// manage the snackbar state
export class NotificationStore {

    @observable
    public isOpen: boolean = false;

    @observable
    public message: string = '';

    @observable
    public severity: AlertColor  = "success";

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    @action
    public show(params: NotificationParams) {
        this.message = params.message;
        this.severity = params.severity;
        this.isOpen = true;
    }

    @action
    public hide(params?: any) {
        this.isOpen = false;
    }
}