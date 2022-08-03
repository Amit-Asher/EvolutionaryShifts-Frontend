import { EmployeeDTO } from './../swagger/stubs/api';
import { action, computed, makeAutoObservable, observable } from "mobx";
import { EmployeePreferencesDTO, PrfSlotDTO } from "../swagger/stubs";
import _ from 'lodash';

// holds all the state related to create new arrangement flow
export class PreferenceStore {

    @observable
    public employeesPreferences: { [empId: string]: EmployeePreferencesDTO } = {};

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    @action changeEmployeePrefSlot(employee: EmployeeDTO | undefined, employeePrfSlot: PrfSlotDTO, isSelected: boolean) {
        if (!employee || !employee.id) {
            return;
        }

        if (!this.employeesPreferences[employee.id]) {
            this.employeesPreferences[employee.id] = {
                employeeId: employee.id,
                employeeName: employee.name,
                preferences: {
                    RuleSlots: {
                        slots: [employeePrfSlot]
                    }
                }
            }
        } else {
            if (!this.employeesPreferences[employee.id]?.preferences?.RuleSlots?.slots) {
                return;
            }

            if (isSelected) {
                this.employeesPreferences[employee.id].preferences.RuleSlots.slots =
                    this.employeesPreferences[employee.id]?.preferences?.RuleSlots?.slots
                        ?.filter((existingSlot: PrfSlotDTO) => {
                            return !_.isEqual(employeePrfSlot, existingSlot);
                        });
            } else {
                this.employeesPreferences[employee.id].preferences.RuleSlots.slots.push(employeePrfSlot);
            }
        }
    }
}
