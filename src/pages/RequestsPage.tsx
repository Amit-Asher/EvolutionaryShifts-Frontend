import { Button, Collapse, MenuItem, Select, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { LoadingPaper } from '../components/Loading/LoadingPaper';
import { ComponentStatus } from '../interfaces/common';
import { companyService } from '../services/companyService';
import { requestsService } from '../services/requestsService';
import { EmployeeDTO, TicketDTO } from '../swagger/stubs';

export const RequestsPage = observer(() => {
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDTO | undefined>(undefined);
    const [allEmployees, setAllEmployees] = useState<EmployeeDTO[]>([]);
    const [tickets, setTickets] = useState<TicketDTO[]>([]);
    const [status, setStatus] = useState<ComponentStatus>(ComponentStatus.LOADING);

    useEffect(() => {
        const fetchProperties = async () => {
            const employees: EmployeeDTO[] = await companyService.getEmployees();
            setSelectedEmployee(employees[0]);
            setAllEmployees(employees);
            const ticketsDto = await requestsService.getAllTickets();
            setTickets(ticketsDto);
            setStatus(ComponentStatus.READY);
        };
        fetchProperties();
    }, []);

    if (status !== ComponentStatus.READY) {
        return <LoadingPaper />;
    }
    return (
        <Paper sx={{ margin: 'auto', overflow: 'hidden', height: '100%' }}>
            <div style={{ width: '100%', height: '100%', padding: '20px' }}>
                <h1> Requests Center</h1>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedEmployee?.fullName ?? ''}
                    style={{ marginBottom: '20px' }}
                    label="Age"
                    onChange={(e) => {
                        const newSelectedEmployee = allEmployees.find(employee => employee.fullName === e.target.value);
                        setSelectedEmployee(newSelectedEmployee);
                    }}
                >
                    {allEmployees.map((employee: EmployeeDTO) => {
                        return <MenuItem value={employee?.fullName || ''}>{employee.fullName}</MenuItem>;
                    })}
                </Select>
                <div>
                    {tickets.filter(ticket => ticket.empName === selectedEmployee?.firstName).map(ticket => {
                        return (
                            <div>
                                <TextField
                                    value={ticket.msg}
                                    style={{ marginBottom: '10px', width: '50%' }}
                                    disabled
                                />
                            </div>);
                    })}
                </div>
            </div>
        </Paper>
    );
});
