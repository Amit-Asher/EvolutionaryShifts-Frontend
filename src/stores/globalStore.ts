import { NotificationStore } from './notificationStore';
import { makeObservable, observable } from "mobx";
import { ArrangementStore } from "./arrangementStore";

export class GlobalStore {
    
    @observable
    public arrangementStore: ArrangementStore;

    @observable
    public notificationStore: NotificationStore;

    constructor() {
        this.notificationStore = new NotificationStore();
        this.arrangementStore = new ArrangementStore();
        makeObservable(this)
    }
}

export const globalStore = new GlobalStore();