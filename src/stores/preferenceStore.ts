import { action, computed, makeAutoObservable, observable } from "mobx";
import { EmployeePreferencesDTO, PrfSlotDTO } from "../swagger/stubs";

// holds all the state related to create new arrangement flow
export class PreferenceStore {

    @observable
    public employeePreferences: EmployeePreferencesDTO = {};

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    @action
    public setEmployeePreferences(employeePreferences: EmployeePreferencesDTO) {
        this.employeePreferences = employeePreferences;
    }

    @computed
    public get employeePrefSlots(): PrfSlotDTO[] {
        return this.employeePreferences.preferences['RuleSlots'].slots;
    }
}