import { PropertiesDTO } from "../swagger/stubs";

export const emptyProperties = {
    activeEmployeesIds: [],
    reqSlots: [],
    rulesWeights: []
};

export const isPropertiesEmpty = (properties: PropertiesDTO): boolean => {
    const noEmployees = properties?.activeEmployeesIds?.length === 0 ?? true;
    const noSlots = properties?.reqSlots?.length === 0 ?? true;
    const noRules = properties?.rulesWeights?.length === 0 ?? true;
    return noEmployees || noSlots || noRules;
};
