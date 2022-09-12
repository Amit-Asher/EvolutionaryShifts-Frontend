import { Button, MenuItem, Select } from '@mui/material';
import Paper from '@mui/material/Paper';
import _ from 'lodash';
import { observer } from 'mobx-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingPaper } from '../components/Loading/LoadingPaper';
import TimeTable, { ReqSlotCell } from '../components/TimeTable/TimeTable';
import { ComponentStatus } from '../interfaces/common';
import { PagesUrl } from '../interfaces/pages.meta';
import { arrangementService } from '../services/arrangementService';
import { companyService } from '../services/companyService';
import { globalStore } from '../stores/globalStore';
import { PreferenceStore } from '../stores/preferenceStore';
import { EmployeeDTO, PrfSlotDTO, PropertiesDTO, ReqSlotDTO } from '../swagger/stubs';

export const PreferencesPage = observer(() => {
    const navigate = useNavigate();
    const preferenceStore: PreferenceStore = globalStore.preferenceStore;
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
                value={selectedEmployee?.fullName ?? ''}
                label="Age"
                onChange={(e) => {
                    const newSelectedEmployee = allEmployees.find(employee => employee.fullName === e.target.value);
                    setSelectedEmployee(newSelectedEmployee);
                }}
            >
                {allEmployees.map((employee: EmployeeDTO, index: number) => {
                    return (<MenuItem key={index.toString()} value={employee?.fullName || ''}>{employee.fullName}</MenuItem>);
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
                            role: reqSlot?.role || '',
                            isSelected: preferenceStore.employeesPreferences?.[selectedEmployee?.id || '']?.preferences?.RuleSlots?.slots?.some((slot: PrfSlotDTO) => {
                                return _.isEqual(slot, {
                                    startTime: reqSlot.startTime,
                                    endTime: reqSlot.endTime,
                                    role: reqSlot.role
                                });
                            })
                        }
                    }) || []}
                    onSelectAppointment={(selectedSlot: ReqSlotCell, isSelected: boolean) => preferenceStore.changeEmployeePrefSlot(
                        selectedEmployee,
                        {
                            role: selectedSlot.role,
                            startTime: moment(selectedSlot.startDate).format('YYYY-MM-DD HH:mm'),
                            endTime: moment(selectedSlot.endDate).format('YYYY-MM-DD HH:mm'),
                        },
                        isSelected
                    )}
                />
            </div>
            {/* SUBMIT BUTTON */}
            <div style={{ display: "flex", float: "right", padding: "40px" }}>
                <Button
                    variant="contained"
                    style={{ height: "50px", width: "100px" }}
                    color="success"
                    onClick={() => {
                        if (!selectedEmployee?.id) {
                            return;
                        }
                        arrangementService.sendPreference(preferenceStore.employeesPreferences[selectedEmployee.id]);
                        navigate(PagesUrl.Emp_Arrangement);
                    }}
                >
                    Submit
                </Button>
            </div>
        </Paper>
    );
});
