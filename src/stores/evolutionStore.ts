import { NotificationStore } from './notificationStore';
import { AlgorithmConfigDTO, EvolutionaryOperatorDTO } from './../swagger/stubs/api';
import { action, computed, makeAutoObservable, observable } from "mobx"

// holds all the state related to create new arrangement flow
export class EvolutionStore {

    private notificationStore: NotificationStore;

    @observable
    public selection: EvolutionaryOperatorDTO = {
        type: '',
        params: {}
    };

    @observable
    public crossover: EvolutionaryOperatorDTO = {
        type: '',
        params: {}
    };

    @observable
    public mutations: EvolutionaryOperatorDTO[] = [{
        type: '',
        params: {}
    }];

    @observable
    public termConds: EvolutionaryOperatorDTO[] = [{
        type: '',
        params: {}
    }];

    @observable
    public elitism: number = 0;

    @observable
    public populationSize: number = 0;


    constructor(notificationStore: NotificationStore) {
        this.notificationStore = notificationStore;
        makeAutoObservable(this, {}, { autoBind: true })
    }

    @action
    public setPopulationSize(populationSize: number) {
        this.populationSize = populationSize;
    }

    
    @action
    public setElitism(elitism: number) {
        this.elitism = elitism;
    }


    @action
    public setSelection(type: string, params: any) {
        if (type !== '') {
            this.selection = { type, params };
        }
    }

    @action
    public setCrossover(type: string, params: any) {
        if (type !== '') {
            this.crossover = { type, params };
        }
    }

    @action
    public addMutation() {
        this.mutations.push({
            type: '',
            params: {}
        });
    }

    @action
    public removeMutation(idx: number) {
        if (idx < this.mutations.length && 0 <= idx) {
            this.mutations.splice(idx, 1);
        }
    }

    @action
    public setMutation(type: string, params: any, idx: number) {
        this.mutations[idx] = { type, params };
    }

    @action
    public addTermCond() {
        this.termConds.push({
            type: '',
            params: {}
        });
    }

    @action
    public removeTermCond(idx: number) {
        if (idx < this.termConds.length && 0 <= idx) {
            this.termConds.splice(idx, 1);
        }
    }

    @action
    public setTermCond(type: string, params: any, idx: number) {
        const isExist = this.termConds.some(termCond => termCond.type === type);
        const emptyParams = Object.keys(params).length === 0;
        if (isExist && emptyParams) {
            this.notificationStore.show({ message: 'Termination Condition Already Exist!', severity:"warning" });
            return;
        }

        this.termConds[idx] = { type, params };
        console.log(`this.termConds: ${JSON.stringify(this.termConds, undefined, 2)}`)
    }

    @computed
    public get algorithmConfig(): AlgorithmConfigDTO {
        let algorithmConfigToReturn: AlgorithmConfigDTO = {};
        algorithmConfigToReturn['populationSize'] = this.populationSize;
        algorithmConfigToReturn['elitism'] = this.elitism;
        algorithmConfigToReturn['crossover'] = this.crossover;
        algorithmConfigToReturn['selection'] = this.selection;
        algorithmConfigToReturn['mutations'] = this.mutations;
        algorithmConfigToReturn['terminationCondition'] = this.termConds;
        return algorithmConfigToReturn;
    }
}