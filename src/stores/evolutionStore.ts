import { NotificationStore } from './notificationStore';
import { AlgorithmConfigDTO, EvolutionaryOperatorDTO, SchemaFamilyDTO } from './../swagger/stubs/api';
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
    public elitism: number = 5;

    @observable
    public populationSize: number = 100;


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

    @action
    public clearAllSettings() {
        this.crossover = {
            type: '',
            params: {}
        };
        this.mutations = [{
            type: '',
            params: {}
        }];
        this.termConds = [{
            type: '',
            params: {}
        }];
        this.populationSize = 0;
        this.elitism = 0;
    }

    @action
    public setPredefinedSettings(allSchemas: SchemaFamilyDTO[]) {
        // clear all previous settings
        this.crossover = {
            type: '',
            params: {}
        };
        this.mutations = [{
            type: '',
            params: {}
        }];
        this.termConds = [{
            type: '',
            params: {}
        }];

        this.populationSize = 100;
        this.elitism = 5;

        const truncationSelection = allSchemas.find(schema => schema?.family === 'selections')?.schemas?.find(schema => schema?.name === 'TruncationSelection');
        if (truncationSelection) {
            this.selection = {
                type: truncationSelection.name ?? '',
                params: {
                    ratio: 0.7
                }
            }
        }

        const basicCrossover = allSchemas.find(schema => schema?.family === 'crossovers')?.schemas?.find(schema => schema?.name === 'BasicCrossover');
        if (basicCrossover) {
            this.crossover = {
                type: basicCrossover.name ?? '',
                params: {
                    crossoverPoints: 3
                }
            }
        }

        const mutationDupsByEmployee = allSchemas.find(schema => schema?.family === 'mutations')?.schemas?.find(schema => schema?.name === 'MutationDupsByEmployee');
        const mutationSwapEmployees = allSchemas.find(schema => schema?.family === 'mutations')?.schemas?.find(schema => schema?.name === 'MutationSwapEmployees');
        const mutationGenerateEmployee = allSchemas.find(schema => schema?.family === 'mutations')?.schemas?.find(schema => schema?.name === 'MutationGenerateEmployee');
        if (mutationDupsByEmployee) {
            this.mutations[0] = {
                type: mutationDupsByEmployee.name ?? '',
                params: {}
            };
        }
        if (mutationSwapEmployees) {
            this.mutations[1] = {
                type: mutationSwapEmployees.name ?? '',
                params: {
                    probability: 0.7,
                    numberOfShiftsToChange: 3
                }
            };
        }
        if (mutationGenerateEmployee) {
            this.mutations[2] = {
                type: mutationGenerateEmployee.name ?? '',
                params: {
                    probability: 0.6,
                    numberOfShiftsToChange: 3
                }
            };
        }

        const generationCount = allSchemas.find(schema => schema?.family === 'term_conds')?.schemas?.find(schema => schema?.name === 'GenerationCount');
        if (generationCount) {
            this.termConds[0] = {
                type: generationCount.name ?? '',
                params: {
                    count: 500
                }
            };
        }
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