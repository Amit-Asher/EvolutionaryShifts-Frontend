import { Button, MenuItem, Select, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { LoadingPaper } from '../components/Loading/LoadingPaper';
import { ComponentStatus } from '../interfaces/common';
import { companyService } from '../services/companyService';
import { requestsService } from '../services/requestsService';
import { EmployeeDTO } from '../swagger/stubs';

export const EmpRequestsPage = observer(() => {
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDTO | undefined>(undefined);
    const [allEmployees, setAllEmployees] = useState<EmployeeDTO[]>([]);
    const [message, setMessage] = useState<string>('');
    const [status, setStatus] = useState<ComponentStatus>(ComponentStatus.LOADING);

    useEffect(() => {
        const fetchProperties = async () => {
            const employees: EmployeeDTO[] = await companyService.getEmployees();
            setSelectedEmployee(employees[0]);
            setAllEmployees(employees);
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
                    <TextField
                        id="filled-multiline-static"
                        multiline
                        rows={15}
                        placeholder="Write comments for manager here..."
                        style={{ width: '100%', height: '400px' }}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
                <div style={{ float: 'right' }}>
                    <Button
                        variant="contained"
                        onClick={() => requestsService.sendTicket(selectedEmployee?.fullName ?? '', message)}
                    >
                        Send
                    </Button>
                </div>
            </div>
        </Paper>
        
    );
});
