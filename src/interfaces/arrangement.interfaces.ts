import { EmployeePreferencesDTO, EmpSlotsPreferenceDTO } from './../swagger/stubs/api';
import { PrfSlotDTO } from "../swagger/stubs";

export interface EmployeeStatus {
    employeeId: string;
    employeeName: string;
    employeeSlots: PrfSlotDTO[]
    roles: string[];
}

export enum RulesTypes {
    RuleFight = 'RuleFight',
    RuleFitEmpRole = 'RuleFitEmpRole',
    RulePeace = 'RulePeace',
    RuleRangeWorkDays = 'RuleRangeWorkDays',
    RuleReqSlots = 'RuleReqSlots',
    RuleSlots = 'RuleSlots'
}

export interface RuleDisplayDetails {
    label: string;
    description: string;
}

export const mapRuleToDisplayDetails: { [rule: string]: RuleDisplayDetails } = {
    [RulesTypes.RuleFight]: {
        label: "Enemies Rule",
        description: "This is a rule that consider if one employee prefer to not work with specific employee"
    },
    [RulesTypes.RuleFitEmpRole]: {
        label: "Qualifications",
        description: "This is a rule that consider the qualifications of the employee"
    },
    [RulesTypes.RulePeace]: {
        label: "Partners Rule",
        description: "this rule consider two employees that want to work together."
    },
    [RulesTypes.RuleRangeWorkDays]: {
        label: "Off days Rule",
        description: "This is a rule that consider off days of the employee"
    },
    [RulesTypes.RuleSlots]: {
        label: "Slots (default)",
        description: "This rule will search the best arrangement that fits with the employees slots"
    }
}
