import { globalStore } from './../stores/globalStore';
import { EmployeeDTO, RoleDTO, CompanyApi, EmployeeApi, RoleApi, EvolutionApi, AlgorithmConfigDTO, SchemaFamilyDTO } from './../swagger/stubs/api';

class EvolutionService {

    schemasCache: SchemaFamilyDTO[] = [];
    
    isSolving: Boolean = false;


    constructor() {
    }

    public getIsSolving(): Boolean{
        return this.isSolving;
    }

    public setIsSolving(isSolving: boolean) {
        this.isSolving = isSolving;
    }
    
    public async solveArrangement(algorithmConfig: AlgorithmConfigDTO): Promise<Boolean> {
        try {
            
            globalStore.notificationStore.show({ message: 'Start solving arrangement...', severity:"success" });
            const res = await (new EvolutionApi()).solveArrangement(algorithmConfig, { credentials: 'include' });
            if (!res.success) {
                globalStore.notificationStore.show({ message: 'Failed to start solving arrangement', severity:"error" });
                return false;
            }

            this.isSolving = true;
            globalStore.notificationStore.show({ message: 'Solving arrangement started successfully!', severity:"success" });
            return true;
        } catch (err) {
            globalStore.notificationStore.show({ message: 'Failed to start solving arrangement', severity:"error" });
            console.error('Failed to start solving arrangement');
            return false;
        }
    }

    public async getSchemas() {
        try {
            if (this.schemasCache.length === 0) {
                const res = await (new EvolutionApi()).getSchemas({ credentials: 'include' });
                if (!res) {
                    globalStore.notificationStore.show({ message: 'Failed to fetch employees', severity:"error" });
                    return [];
                }
                this.schemasCache = res ?? [];
            }
            return this.schemasCache ?? [];
        } catch (err) {
            globalStore.notificationStore.show({ message: 'Failed to fetch employees', severity:"error" });
            console.error('[companyService][getEmployees] Failed to fetch employees');
            return this.schemasCache ?? [];
        }
    }
}

export const evolutionService = new EvolutionService();