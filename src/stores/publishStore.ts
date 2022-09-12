
import { action, computed, makeAutoObservable, makeObservable, observable, set, toJS } from "mobx"
import { ReqSlotCell } from "../components/TimeTable/TimeTable";
import { NotificationStore } from "./notificationStore";



export class PublishStore {
    @observable
    public fitness: string = " ";

    @observable
    public elasedTime: string = " ";

    @observable
    public generationNumber: string = " ";

    @observable
    public stagnationStatus: string = " ";

    @observable
    public progressBarGen: number = 0;

    @observable
    public progressBarFitness: number = 0;

    @observable
    public progressBarTimer: number = 0;

    @observable
    public allRoles: string[] = [];

    @observable
    public reqslots: ReqSlotCell[] = [];

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    @action
    public setFitness(fitness: string) {
        this.fitness = fitness;
    }

    @action
    public setElasedTime(elasedTime: string) {
        this.elasedTime = elasedTime;
    }

    @action
    public setGenerationNumber(generationNumber: string) {
        this.generationNumber = generationNumber;
    }

    @action
    public setStagnationStatus(stagnationStatus: string) {
        this.stagnationStatus = stagnationStatus;
    }

    @action
    public setProgressBarGen(progressBarGen: number) {
        this.progressBarGen = progressBarGen;
    }

    @action
    public setProgressBarFitness(progressBarFitness: number) {
        this.progressBarFitness = progressBarFitness;
    }

    @action
    public setProgressBarTimer(progressBarTimer: number) {
        this.progressBarTimer = progressBarTimer;
    }

    @action
    public setAllRoles(allRoles: string[]) {
        this.allRoles = allRoles;
    }

    @action
    public setReqslots(reqslots: ReqSlotCell[]) {
        this.reqslots = reqslots;
    }
}