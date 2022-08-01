import { MenuItem, Select } from '@mui/material';
import Paper from '@mui/material/Paper';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingPaper } from '../components/Loading/LoadingPaper';
import TimeTable, { ReqSlotCell } from '../components/TimeTable/TimeTable';
import { ComponentStatus } from '../interfaces/common';
import { arrangementService } from '../services/arrangementService';
import { companyService } from '../services/companyService';
import { EmployeeDTO, PropertiesDTO, ReqSlotDTO } from '../swagger/stubs';

export const PreferencesPage = observer(() => {
    const navigate = useNavigate();
    const [properties, setProperties] = useState<PropertiesDTO>({});
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDTO | undefined>(undefined);
    const [allEmployees, setAllEmployees] = useState<EmployeeDTO[]>([]);
    const [status, setStatus] = useState<ComponentStatus>(ComponentStatus.LOADING);

    useEffect(() => {
        const fetchProperties = async () => {
            const propertiesFromServer: PropertiesDTO = await arrangementService.getProperties();
            const employees: EmployeeDTO[] = await companyService.getEmployees();
            setSelectedEmployee(employees[0]);
            setAllEmployees(employees);
            setProperties(propertiesFromServer);
            setStatus(ComponentStatus.READY);
        };
        fetchProperties();
    }, []);

    if (status !== ComponentStatus.READY) {
        return <LoadingPaper />;
    }


    return (
        <Paper sx={{ margin: 'auto', overflow: 'hidden', height: '100%' }}>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedEmployee?.name ?? ''}
                label="Age"
                onChange={(e) => {
                    const newSelectedEmployee = allEmployees.find(employee => employee.name === e.target.value);
                    setSelectedEmployee(newSelectedEmployee);
                }}
            >
                {allEmployees.map((employee: EmployeeDTO) => {
                    return <MenuItem value={employee?.name || ''}>{employee.name}</MenuItem>;
                })}
            </Select>

            <div style={{ backgroundColor: "#fff", padding: "20px" }}>
                <TimeTable
                    views={selectedEmployee?.roles || []}
                    slots={properties.reqSlots?.map((reqSlot: ReqSlotDTO, idx): ReqSlotCell => {
                        return {
                            id: idx,
                            startDate: new Date(reqSlot?.startTime || ''), // "2022-07-19T12:00"
                            endDate: new Date(reqSlot?.endTime || ''),
                            minPersonnelSize: 0,
                            maxPersonnelSize: 0,
                            title: "*Option", // by design, title is always "Required*"
                            role: reqSlot?.role || ''
                        }
                    }) || []}
                />
            </div>
        </Paper>
    );
});
