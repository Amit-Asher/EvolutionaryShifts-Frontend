import { globalStore } from './../stores/globalStore';
import { EmployeeDTO, RoleDTO, CompanyApi, EmployeeApi, RoleApi } from './../swagger/stubs/api';

class CompanyService {

    employeesCache: EmployeeDTO[] = [];
    rolesCache: string[] = [];

    constructor() {
    }

    public async getEmployees(): Promise<EmployeeDTO[]> {
        try {
            if (this.employeesCache.length === 0) {
                const res = await (new EmployeeApi()).getAllEmployees({ credentials: 'include' });
                if (!res) {
                    globalStore.notificationStore.show({ message: 'Failed to fetch employees' });
                    return [];
                }
                this.employeesCache = res.employees ?? [];
            }
            return this.employeesCache ?? [];
        } catch (err) {
            globalStore.notificationStore.show({ message: 'Failed to fetch employees' });
            console.error('[companyService][getEmployees] Failed to fetch employees');
            return this.employeesCache ?? [];
        }
    }


    public async getRoles(): Promise<string[]> {
        try {
            if (this.rolesCache.length === 0) {
                const res = await (new RoleApi()).getAllRoles({ credentials: 'include' });
                if (!res) {
                    globalStore.notificationStore.show({ message: 'Failed to fetch employees roles' });
                    return [];
                }
                this.rolesCache = res.names ?? [];
            }
            return this.rolesCache ?? [];
        } catch (err) {
            console.error('[companyService][getRoles] Failed to fetch employees roles');
            globalStore.notificationStore.show({ message: 'Failed to fetch employees roles' });
            return this.rolesCache ?? [];
        }
    }
}

export const companyService = new CompanyService();