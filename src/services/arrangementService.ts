import { globalStore } from '../stores/globalStore';
import { ArrangementApi, PropertiesDTO, SlotsPreferencesDTO, EmpSlotsPreferenceDTO } from './../swagger/stubs/api';
import { emptyProperties, isPropertiesEmpty } from './arrangement.utils';

class ArrangementService {

    preferencesCache: EmpSlotsPreferenceDTO[] = [];
    propertiesCache: PropertiesDTO = emptyProperties;

    constructor() {
    }

    public async sendProperties(properties: PropertiesDTO): Promise<void> {
        try {
            globalStore.notificationStore.show({ message: 'Creating new arrangement...' });
            const res = await (new ArrangementApi()).createArrangement(properties);
            if (!res.success) {
                globalStore.notificationStore.show({ message: 'Failed to create new arrangement' });
                return;
            }

            globalStore.notificationStore.show({ message: 'New arrangement created Successfully!' });
        } catch (err) {
            globalStore.notificationStore.show({ message: 'Failed to create new arrangement' });
            console.error('Failed to create new arrangement');
        }
    }

    public async getPreferences(): Promise<EmpSlotsPreferenceDTO[]> {
        try {
            if (this.preferencesCache.length === 0) {
                const res: SlotsPreferencesDTO = await (new ArrangementApi()).getPreferences();
                if (!res) {
                    globalStore.notificationStore.show({ message: 'Failed to fetch employees preferences' });
                    return [];
                }
                this.preferencesCache = res.preferences ?? [];
            }
            return this.preferencesCache ?? [];

        } catch (err) {
            globalStore.notificationStore.show({ message: 'Failed to fetch employees preferences' });
            console.error('Failed to fetch employees preferences');
            return this.preferencesCache ?? [];
        }
    }

    public async getProperties(): Promise<PropertiesDTO> {
        try {
            if (isPropertiesEmpty(this.propertiesCache)) {
                const res: PropertiesDTO = await (new ArrangementApi()).getProperties();
                if (!res) {
                    globalStore.notificationStore.show({ message: 'Failed to fetch arrangement properties' });
                    return emptyProperties;
                }
                this.propertiesCache = res ?? emptyProperties;
            }
            return this.propertiesCache ?? emptyProperties;

        } catch (err) {
            globalStore.notificationStore.show({ message: 'Failed to fetch arrangement properties' });
            console.error('Failed to fetch arrangement properties');
            return this.propertiesCache ?? [];
        }
    }
}

export const arrangementService = new ArrangementService();