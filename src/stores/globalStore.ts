import { NotificationStore } from './notificationStore';
import { makeObservable, observable } from "mobx";
import { ArrangementStore } from "./arrangementStore";
import { EvolutionStore } from './evolutionStore';
import { PreferenceStore } from './preferenceStore';
import { PublishStore } from './publishStore';

export class GlobalStore {
    
    @observable
    public arrangementStore: ArrangementStore;

    @observable
    public publishStore: PublishStore;

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
        this.publishStore = new PublishStore();
        makeObservable(this)
    }
}

export const globalStore = new GlobalStore();