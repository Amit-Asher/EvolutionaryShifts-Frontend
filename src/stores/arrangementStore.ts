import { ReqSlotCell } from './../components/TimeTable/TimeTable';
import { action, computed, makeAutoObservable, makeObservable, observable, set, toJS } from "mobx"
import moment from 'moment';
import { PropertiesDTO, ReqSlotDTO, RuleWeightDTO, SchemaDTO, SchemaFamilyDTO } from '../swagger/stubs';
import { arrangementService } from '../services/arrangementService';

interface RuleSelection {
    ruleName: string;
    weight: number;
    enable: boolean;
}

// holds all the state related to create new arrangement flow
export class ArrangementStore {

    @observable
    public activeEmployeesIds: string[] = [];

    @observable
    public reqSlots: ReqSlotCell[] = [];

    @observable
    public selectedRules: RuleSelection[] = [];

    @observable
    public isInitialized: boolean = false;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    @action
    public async initialize() {
        const allRules: SchemaFamilyDTO = await arrangementService.getRulesOptions();
        allRules.schemas?.forEach((schema: SchemaDTO) => {
            if (!schema?.name) {
                return;
            }
            this.selectedRules.push({
                ruleName: schema.name,
                weight: 0,
                enable: false
            })
        })
        this.isInitialized = true;
    }

    @action
    public setEmployeeAsActive(employeeId?: string) {
        const isEmployeeActive = this.activeEmployeesIds?.some(activeEmployeeId => activeEmployeeId === employeeId);

        if (employeeId && !isEmployeeActive) {
            this.activeEmployeesIds?.push(employeeId);
        }
    }

    @action
    public unsetEmployeeAsActive(employeeId?: string) {
        this.activeEmployeesIds = this.activeEmployeesIds?.filter(empId => empId !== employeeId);
    }

    @action
    public setActiveEmployees(ids: string[]) {
        this.activeEmployeesIds = ids;
    }


    @action
    public setReqSlots(reqSlots: ReqSlotCell[]) {
        this.reqSlots = reqSlots;
        console.log(`this.reqSlots: ${JSON.stringify(this.reqSlots, undefined, 2)}`)
    }

    @action
    public setRuleWeight(rule: string | undefined, weight: number) {
        if (!rule) {
            return;
        }

        // remove old
        this.selectedRules = this.selectedRules?.filter(selectedRule => selectedRule.ruleName !== rule);
        // add new (always overide)
        this.selectedRules?.push({
            ruleName: rule,
            weight: weight ?? 0,
            enable: true
        });

        console.log(`this.selectedRules: ${JSON.stringify(this.selectedRules, undefined, 2)}`)
    }

    @action
    public enableRule(rule: string | undefined) {
        if (!rule) {
            return;
        }

        const selectedRule = this.selectedRules?.find(selectedRule => selectedRule.ruleName === rule);

        if (selectedRule) { // rule found
            selectedRule.enable = true;
            return;
        }

        this.selectedRules.push({
            ruleName: rule,
            weight: 0,
            enable: true
        });
        console.log(`this.selectedRules: ${JSON.stringify(this.selectedRules, undefined, 2)}`)
    }

    @action
    public disableRule(rule: string | undefined) {
        if (!rule) {
            return;
        }

        const selectedRule = this.selectedRules?.find(selectedRule => selectedRule.ruleName === rule);
        if (selectedRule) { // rule found
            selectedRule.weight = 0;
            selectedRule.enable = false;
        }
        console.log(`this.selectedRules: ${JSON.stringify(this.selectedRules, undefined, 2)}`)
    }

    @computed
    public get properties(): PropertiesDTO {

        // build rules weights
        const rulesWeights: RuleWeightDTO[] = this.selectedRules
            .filter(selectedRule => selectedRule.enable)
            .map(selectedRule => ({
                ruleName: selectedRule.ruleName,
                weight: selectedRule.weight
            }));

        // build req slots
        const reqSlotsDto: ReqSlotDTO[] = this.reqSlots
            .map((reqSlot: ReqSlotCell) => ({
                startTime: moment(reqSlot.startDate).format('YYYY-MM-DD HH:mm'),
                endTime: moment(reqSlot.endDate).format('YYYY-MM-DD HH:mm'),
                role: reqSlot.role,
                personnelSize: {
                    max: reqSlot.maxPersonnelSize,
                    min: reqSlot.minPersonnelSize
                },
            }))

        return {
            rulesWeights,
            activeEmployeesIds: this.activeEmployeesIds,
            reqSlots: reqSlotsDto
        };
    }

    @computed
    public get sumOfRulesWeights(): number {
        return this.selectedRules.reduce((curSum: number, rule: RuleSelection) => {
            return rule.enable ? curSum + rule.weight : curSum;
        }, 0);
    }
}