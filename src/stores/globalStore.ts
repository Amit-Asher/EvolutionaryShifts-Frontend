import { NotificationStore } from './notificationStore';
import { makeObservable, observable } from "mobx";
import { ArrangementStore } from "./arrangementStore";
import { EvolutionStore } from './evolutionStore';

export class GlobalStore {
    
    @observable
    public arrangementStore: ArrangementStore;

    @observable
    public evolutionStore: EvolutionStore;

    @observable
    public notificationStore: NotificationStore;

    constructor() {
        this.notificationStore = new NotificationStore();
        this.arrangementStore = new ArrangementStore();
        this.evolutionStore = new EvolutionStore();
        makeObservable(this)
    }
}

export const globalStore = new GlobalStore();