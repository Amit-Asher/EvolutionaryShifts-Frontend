import { ReqSlotCell } from './../components/TimeTable/TimeTable';
import { PropertiesDTO, ReqSlotDTO, RoleDTO, RuleWeightDTO, RangeDTO, EvolutionaryOperatorDTO } from './../swagger/stubs/api';
import { action, computed, makeAutoObservable, makeObservable, observable, set, toJS } from "mobx"
import moment from 'moment';

// holds all the state related to create new arrangement flow
export class EvolutionStore {

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
    public mutations: EvolutionaryOperatorDTO[] = [];

    @observable
    public termCond: EvolutionaryOperatorDTO[] = []

    @observable
    public elitism: number = 0;

    @observable
    public populationSize: number = 0;


    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
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
    public addMutation(type: string, params: any) {
        if (type !== '') {
            this.mutations.push({ type, params });
        }
    }

    @action
    public removeMutation(idx: number) {
        if (idx < this.mutations.length && 0 <= idx) {
            this.mutations.splice(idx, 1);
        }
    }

    @action
    public addTermCond(type: string, params: any) {
        if (type !== '') {
            this.termCond.push({ type, params });
        }
    }

    @action
    public removeTermCond(idx: number) {
        if (idx < this.termCond.length && 0 <= idx) {
            this.termCond.splice(idx, 1);
        }
    }
}