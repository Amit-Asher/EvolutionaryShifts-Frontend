import { makeObservable, observable } from "mobx";
import { ArrangementStore } from "./arrangementStore";

export class GlobalStore {
    
    @observable
    public arrangementStore: ArrangementStore;

    constructor() {
        this.arrangementStore = new ArrangementStore();
        makeObservable(this)
    }
}

export const globalStore = new GlobalStore();