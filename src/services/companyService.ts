import { EmployeeDTO, RoleDTO, CompanyApi, EmployeeApi } from './../swagger/stubs/api';

class CompanyService {

    employeesCache: EmployeeDTO[] = [];
    rolesCache: RoleDTO[] = [];

    constructor() {
    }

    public getEmployees(): EmployeeDTO[] {
        try {
            const res = (new EmployeeApi()).getAllEmployeesUsingGET();
            console.log(`res: ${JSON.stringify(res, undefined, 2)}`)
        } catch (err) {

        }
        return [];
    }

    public getRoles(): RoleDTO[] {
        try {

        } catch (err) {

        }
        return [];
    }
}

export const companyService = new CompanyService();