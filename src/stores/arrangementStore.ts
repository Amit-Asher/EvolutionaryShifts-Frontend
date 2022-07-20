import { PropertiesDTO, ReqSlotDTO, RoleDTO, RuleWeightDTO } from './../swagger/stubs/api';
import { action, makeObservable, observable, set } from "mobx"

export class ArrangementStore {

    @observable
    public properties: PropertiesDTO = {
        activeEmployeesIds: [],
        reqSlots: [],
        rulesWeights: []
    };

    constructor() {
        makeObservable(this)
    }

    @action
    public setEmployeeAsActive(employeeId?: string) {
        const isEmployeeActive = this.properties?.activeEmployeesIds?.some(activeEmployeeId => activeEmployeeId === employeeId);

        if (employeeId && !isEmployeeActive) {
            this.properties.activeEmployeesIds?.push(employeeId);
        }
    }

    @action
    public unsetEmployeeAsActive(employeeId?: string) {
        this.properties.activeEmployeesIds = this.properties.activeEmployeesIds?.filter(empId => empId !== employeeId);
    }

    @action
    public setReqSlot(reqSlot: ReqSlotDTO) {

        // TODO: improve error handling
        const isReqSlotExist = this.properties.reqSlots?.some(existingReqSlot => (
            existingReqSlot.startTime === reqSlot.startTime && existingReqSlot.role !== reqSlot.role)
        );

        if (!isReqSlotExist) {
            this.properties.reqSlots?.push(reqSlot);
        }
    }

    @action
    public unsetReqSlot(startTime: string, role: string) {
        this.properties.reqSlots = this.properties.reqSlots?.filter(reqSlot => reqSlot.startTime !== startTime || reqSlot.role !== role);
    }

    @action
    public setRuleWeight(rule: string, weight: number) {
        const newRuleWeight: RuleWeightDTO = { ruleName: rule, weight };
        this.properties.rulesWeights = this.properties.rulesWeights?.filter(curRuleWeight => curRuleWeight.ruleName !== newRuleWeight.ruleName);
        this.properties.rulesWeights?.push(newRuleWeight);
    }

}