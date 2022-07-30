import { globalStore } from './../stores/globalStore';
import { EmployeeDTO, RoleDTO, CompanyApi, EmployeeApi, RoleApi, EvolutionApi, AlgorithmConfigDTO } from './../swagger/stubs/api';

class EvolutionService {

    constructor() {
    }

    public async solveArrangement(algorithmConfig: AlgorithmConfigDTO): Promise<void> {
        try {
            globalStore.notificationStore.show({ message: 'Start solving arrangement...' });
            const res = await (new EvolutionApi()).solveArrangement(algorithmConfig);
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

}

export const evolutionService = new EvolutionService();