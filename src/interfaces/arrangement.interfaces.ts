import { EmployeePreferencesDTO, EmpSlotsPreferenceDTO } from './../swagger/stubs/api';
import { PrfSlotDTO } from "../swagger/stubs";

export interface EmployeeStatus {
    employeeId: string;
    employeeName: string;
    employeeSlots: PrfSlotDTO[]
    roles: string[];
}