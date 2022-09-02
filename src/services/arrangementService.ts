import { globalStore } from '../stores/globalStore';
import { ArrangementApi, PropertiesDTO, SlotsPreferencesDTO, EmpSlotsPreferenceDTO, EmployeeApi, EmployeePreferencesDTO, SchemaFamilyDTO } from './../swagger/stubs/api';
import { emptyProperties, isPropertiesEmpty } from './arrangement.utils';

class ArrangementService {

    preferencesCache: EmpSlotsPreferenceDTO[] = [];
    propertiesCache: PropertiesDTO = emptyProperties;
    rulesOptionsCache: SchemaFamilyDTO = {};

    constructor() {
    }

    public async getRulesOptions(): Promise<SchemaFamilyDTO> {
        try {
            if (isPropertiesEmpty(this.propertiesCache)) {
                const res: SchemaFamilyDTO = await (new ArrangementApi()).getRulesOptions({ credentials: 'include' });
                if (!res) {
                    globalStore.notificationStore.show({ message: 'Failed to fetch rules options', severity:"error" });
                    return {};
                }
                this.rulesOptionsCache = res ?? {};
            }
            return this.rulesOptionsCache ?? {};

        } catch (err) {
            globalStore.notificationStore.show({ message: 'Failed to fetch rules options', severity:"error" });
            console.error('Failed to fetch rules options');
            return this.rulesOptionsCache ?? {};
        }
    }

    public async sendProperties(properties: PropertiesDTO): Promise<void> {
        try {
            globalStore.notificationStore.show({ message: 'Creating new arrangement...', severity: "success" });
            const res = await (new ArrangementApi()).createArrangement(properties, { credentials: 'include' });
            if (!res.success) {
                globalStore.notificationStore.show({ message: 'Failed to create new arrangement', severity:"error" });
                return;
            }

            globalStore.notificationStore.show({ message: 'New arrangement created Successfully!', severity:"success" });
        } catch (err) {
            globalStore.notificationStore.show({ message: 'Failed to create new arrangement', severity:"error" });
            console.error('Failed to create new arrangement');
        }
    }

    public async getPreferences(): Promise<EmpSlotsPreferenceDTO[]> {
        try {
            if (this.preferencesCache.length === 0) {
                const res: SlotsPreferencesDTO = await (new ArrangementApi()).getPreferences({ credentials: 'include' });
                if (!res) {
                    globalStore.notificationStore.show({ message: 'Failed to fetch employees preferences', severity:"error" });
                    return [];
                }
                this.preferencesCache = res.preferences ?? [];
            }
            return this.preferencesCache ?? [];

        } catch (err) {
            globalStore.notificationStore.show({ message: 'Failed to fetch employees preferences', severity:"error" });
            console.error('Failed to fetch employees preferences');
            return this.preferencesCache ?? [];
        }
    }

    public async getProperties(): Promise<PropertiesDTO> {
        try {
            if (isPropertiesEmpty(this.propertiesCache)) {
                const res: PropertiesDTO = await (new ArrangementApi()).getProperties({ credentials: 'include' });
                if (!res) {
                    globalStore.notificationStore.show({ message: 'Failed to fetch arrangement properties', severity:"error" });
                    return emptyProperties;
                }
                this.propertiesCache = res ?? emptyProperties;
            }
            return this.propertiesCache ?? emptyProperties;

        } catch (err) {
            globalStore.notificationStore.show({ message: 'Failed to fetch arrangement properties', severity:"error" });
            console.error('Failed to fetch arrangement properties');
            return this.propertiesCache ?? [];
        }
    }

    public async sendPreference(employeePreferences: EmployeePreferencesDTO) {
        try {
            globalStore.notificationStore.show({ message: 'Sending employee preference...', severity:"success" });
            const res = await (new ArrangementApi()).addPreferences(employeePreferences, { credentials: 'include' });
            if (!res.success) {
                globalStore.notificationStore.show({ message: 'Failed to send employee preference', severity:"error" });
                return;
            }

            globalStore.notificationStore.show({ message: 'Send employee preference completed successfully!', severity:"success" });
        } catch (err) {
            globalStore.notificationStore.show({ message: 'Failed to send employee preference', severity:"error" });
            console.error('Failed to send employee preference');
        }
    }
}

export const arrangementService = new ArrangementService();