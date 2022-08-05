import { NotificationStore } from './notificationStore';
import { makeObservable, observable } from "mobx";
import { ArrangementStore } from "./arrangementStore";
import { EvolutionStore } from './evolutionStore';
import { PreferenceStore } from './preferenceStore';

export class GlobalStore {
    
    @observable
    public arrangementStore: ArrangementStore;

    @observable
    public evolutionStore: EvolutionStore;

    @observable
    public notificationStore: NotificationStore;

    @observable
    public preferenceStore: PreferenceStore;

    constructor() {
        this.notificationStore = new NotificationStore();
        this.arrangementStore = new ArrangementStore();
        this.evolutionStore = new EvolutionStore(this.notificationStore);
        this.preferenceStore = new PreferenceStore();
        makeObservable(this)
    }
}

export const globalStore = new GlobalStore();