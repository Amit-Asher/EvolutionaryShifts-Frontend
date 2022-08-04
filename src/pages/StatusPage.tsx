import { Button, MenuItem, Select } from "@mui/material";
import Paper from "@mui/material/Paper";
import { observer } from "mobx-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { LoadingPaper } from "../components/Loading/LoadingPaper";
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

export const StatusPage = observer(() => {
    const arrangementStore = globalStore.arrangementStore;
    const navigate = useNavigate();
    const [employeesStatus, setEmployeesStatus] = useState<EmployeeStatus[]>([]);
    const [curEmployee, setCurEmployee] = useState<EmployeeStatus | undefined>();
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
            })
            );
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

    return (
        <Paper sx={{ margin: "auto", overflow: "hidden", height: "100%" }}>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={curEmployee?.employeeName ?? ''}
                label="Age"
                onChange={(e) => {
                    const employeeStatus = employeesStatus.find(employeeStatus => employeeStatus.employeeName === e.target.value);
                    setCurEmployee(employeeStatus);
                }}
            >
                {employeesStatus.map((empStatus: EmployeeStatus) => {
                    return <MenuItem value={empStatus.employeeName}>{empStatus.employeeName}</MenuItem>;
                })}
            </Select>
            <div style={{ backgroundColor: "#fff", padding: "20px" }}>
                <TimeTable
                    views={curEmployee?.roles ?? ['N/A']}
                    slots={cellsOfTimeTable}
                    setSlots={undefined}
                />
            </div>

            {/* NEXT BUTTON */}
            <div style={{ display: "flex", float: "right", padding: "40px" }}>
                <Button
                    variant="contained"
                    style={{ height: "50px", width: "100px" }}
                    onClick={() => {
                        navigate(PagesUrl.Arrangement_Evolution);
                    }}
                >
                    Next
                </Button>
            </div>
        </Paper>
    );
});
