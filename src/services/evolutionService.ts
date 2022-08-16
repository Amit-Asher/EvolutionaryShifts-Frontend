import { globalStore } from './../stores/globalStore';
import { EmployeeDTO, RoleDTO, CompanyApi, EmployeeApi, RoleApi, EvolutionApi, AlgorithmConfigDTO, SchemaFamilyDTO } from './../swagger/stubs/api';

class EvolutionService {

    schemasCache: SchemaFamilyDTO[] = [];

    constructor() {
    }

    public async solveArrangement(algorithmConfig: AlgorithmConfigDTO): Promise<void> {
        try {
            globalStore.notificationStore.show({ message: 'Start solving arrangement...' });
            const res = await (new EvolutionApi()).solveArrangement(algorithmConfig, { credentials: 'include' });
            if (!res.success) {
                globalStore.notificationStore.show({ message: 'Failed to start solving arrangement' });
                return;
            }

            globalStore.notificationStore.show({ message: 'Solving arrangement started successfully!' });
        } catch (err) {
            globalStore.notificationStore.show({ message: 'Failed to start solving arrangement' });
            console.error('Failed to start solving arrangement');
        }
    }

    public async getSchemas() {
        try {
            if (this.schemasCache.length === 0) {
                const res = await (new EvolutionApi()).getSchemas({ credentials: 'include' });
                if (!res) {
                    globalStore.notificationStore.show({ message: 'Failed to fetch employees' });
                    return [];
                }
                this.schemasCache = res ?? [];
            }
            return this.schemasCache ?? [];
        } catch (err) {
            globalStore.notificationStore.show({ message: 'Failed to fetch employees' });
            console.error('[companyService][getEmployees] Failed to fetch employees');
            return this.schemasCache ?? [];
        }
    }
}

export const evolutionService = new EvolutionService();