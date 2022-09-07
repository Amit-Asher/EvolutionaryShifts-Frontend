import { Button, Divider, MenuItem, Select } from "@mui/material";
import Paper from "@mui/material/Paper";
import { observer } from "mobx-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { LoadingPaper } from "../components/Loading/LoadingPaper";
import { StatusBar, StatusBarProps } from "../components/StatusBar/StatusBar";
import TimeTable from "../components/TimeTable/TimeTable";
import { EmployeeStatus } from "../interfaces/arrangement.interfaces";
import { ComponentStatus } from "../interfaces/common";
import { PagesUrl } from "../interfaces/pages.meta";
import { arrangementService } from "../services/arrangementService";
import { companyService } from "../services/companyService";
import { globalStore } from "../stores/globalStore";
import {
    EmployeeDTO,
    EmpSlotsPreferenceDTO,
    PrfSlotDTO,
} from "../swagger/stubs";
import { ReactComponent as CheckIcon } from '../themes/check.svg';


export const StatusPage = observer(() => {
    const arrangementStore = globalStore.arrangementStore;
    const navigate = useNavigate();
    const [employeesStatus, setEmployeesStatus] = useState<EmployeeStatus[]>([]);
    const [curEmployee, setCurEmployee] = useState<EmployeeStatus | undefined>();
    const [statusBarsData, setStatusBarsData] = useState<StatusBarProps[]>();
    const [status, setStatus] = useState<ComponentStatus>(ComponentStatus.LOADING);

    let count = 0;

    useEffect(() => {
        const fetchData = async () => {
            const allEmployees: EmployeeDTO[] = await companyService.getEmployees();
            const allPreferences: EmpSlotsPreferenceDTO[] = await arrangementService.getPreferences();
            const employeesStatusToSet: EmployeeStatus[] = allPreferences?.map((empPref: EmpSlotsPreferenceDTO) => ({
                employeeId: empPref?.employeeId ?? '',
                employeeName: empPref?.employeeName ?? '',
                roles: allEmployees.find((emp) => emp.id === empPref.employeeId)?.roles ?? [],
                employeeSlots: empPref?.employeeSlots ?? []
            }));
            const statusBars: StatusBarProps[] = allEmployees.map((employee: EmployeeDTO) => {
                return {
                    title: employee.fullName ?? '',
                    isActive: allPreferences.some(pref => pref.employeeId === employee.id)
                };
            });
            setStatusBarsData(statusBars);
            setCurEmployee(employeesStatusToSet[0]);
            setEmployeesStatus(employeesStatusToSet);
            setStatus(ComponentStatus.READY);
        };
        fetchData();
    }, []);

    const cellsOfTimeTable = curEmployee?.employeeSlots?.map((slot: PrfSlotDTO) => {
        count = count + 1;
        return {
            id: count,
            startDate: new Date(moment(slot.startTime ?? "").format("YYYY-MM-DD HH:mm")),
            endDate: new Date(moment(slot.endTime ?? "").format("YYYY-MM-DD HH:mm")),
            minPersonnelSize: 0,
            maxPersonnelSize: 0,
            title: "Prefered*", // by design, title is always "Prefered*"
            role: slot.role ?? ""
        }
    }) ?? [];


    if (status !== ComponentStatus.READY) {
        return <LoadingPaper />;
    }

    return (<>
        <div style={{
            width: '100%',
            height: '600px',
            display: 'flex'
        }}>
            <div style={{
                width: '20%', height: '100%', backgroundColor: '#fff', marginRight: '10px ', boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
                borderRadius: '8px',
                transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
            }}>
                <div style={{ width: '100%', color: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', display: 'flex' }}><h3>Employees Status</h3></div>
                <div style={{ width: '100%', color: 'rgba(0, 0, 0, 0.6)', padding: '0px 20px', display: 'flex' }}><h6>Choose employee from the following list to show its preferences:</h6></div>
                <div style={{ padding: '0px 15px' }}>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={curEmployee?.employeeName ?? ''}
                        label="Age"
                        onChange={(e) => {
                            const employeeStatus = employeesStatus.find(employeeStatus => employeeStatus.employeeName === e.target.value);
                            setCurEmployee(employeeStatus);
                        }}
                        style={{ width: '100%', height: '40px' }}
                    >
                        {employeesStatus.map((empStatus: EmployeeStatus) => {
                            return <MenuItem value={empStatus.employeeName}>{empStatus.employeeName}</MenuItem>;
                        })}
                    </Select>
                </div>
                <div style={{ margin: '10px 10px' }}>
                    <Divider style={{ marginBottom: '40px' }} />
                </div>
                <div style={{ overflow: 'auto', height: '360px', marginTop: '-30px' }}>
                    {statusBarsData?.sort((a: StatusBarProps, b: StatusBarProps) => a.isActive ? -1 : 1).map((statusBar) => {
                        return (<StatusBar
                            title={statusBar.title}
                            isActive={statusBar.isActive}
                        />);
                    })}
                </div>
            </div>
            <div style={{
                width: '80%', height: '100%', overflow: 'hidden', boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
                borderRadius: '8px',
                transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
            }}>
                <div style={{ backgroundColor: "#fff", padding: "20px", height: '100%' }}>
                    <TimeTable
                        views={curEmployee?.roles ?? ['N/A']}
                        slots={cellsOfTimeTable}
                        setSlots={undefined}
                    />
                </div>
            </div>
        </div>
    </>);
});
