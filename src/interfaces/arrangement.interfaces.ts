import { EmployeePreferencesDTO, EmpSlotsPreferenceDTO } from './../swagger/stubs/api';
import { PrfSlotDTO } from "../swagger/stubs";

export interface EmployeeStatus {
    empPref: EmpSlotsPreferenceDTO;
    roles: string[];
}