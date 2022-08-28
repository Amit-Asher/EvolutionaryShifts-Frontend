import {
    Button,
    Checkbox,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    TextField,
} from "@mui/material";
import { ArrangementStore } from "../stores/arrangementStore";
import { globalStore } from "../stores/globalStore";
import { observer } from "mobx-react";
import { EmployeeDTO, SchemaDTO, SchemaFamilyDTO } from "../swagger/stubs";
import { mock } from "../mocks/mockData";
import { useEffect, useState } from "react";
import TimeTable from "../components/TimeTable/TimeTable";
import Typography from "@mui/material/Typography";
import { ComponentStatus } from "../interfaces/common";
import { companyService } from "../services/companyService";
import { LoadingPaper } from "../components/Loading/LoadingPaper";
import { arrangementService } from "../services/arrangementService";
import { useNavigate } from 'react-router-dom';
import { PagesUrl } from "../interfaces/pages.meta";

enum NewArgmtSubTab {
    Slots,
    Employees,
    Rules
}

export const NewArrangementPage = observer(() => {
    const arrangementStore: ArrangementStore = globalStore.arrangementStore;
    const navigate = useNavigate();
    const [allRoles, setAllRoles] = useState<string[]>([]);
    const [allEmployees, setAllEmployees] = useState<EmployeeDTO[]>([]);
    const [allRules, setAllRules] = useState<SchemaFamilyDTO>({});
    const [status, setStatus] = useState<ComponentStatus>(
        ComponentStatus.LOADING
    );
    const [currentTab, setCurrentTab] = useState<NewArgmtSubTab>(NewArgmtSubTab.Slots);

    useEffect(() => {
        const fetchRoles = async () => {
            const employees: EmployeeDTO[] = await companyService.getEmployees();
            const roles: string[] = await companyService.getRoles();
            const allRules: SchemaFamilyDTO = await arrangementService.getRulesOptions();
            setAllRoles(roles);
            setAllEmployees(employees);
            setAllRules(allRules);
            setStatus(ComponentStatus.READY);
        };
        fetchRoles();
    }, []);

    if (status !== ComponentStatus.READY) {
        return <LoadingPaper />;
    }

    const getSlotsTab = () => {
        return <div>
            <div style={{ backgroundColor: "#fff", padding: "20px" }}>
                <TimeTable
                    views={allRoles}
                    slots={arrangementStore.reqSlots}
                    setSlots={arrangementStore.setReqSlots}
                />
            </div>
        </div>
    }

    const getEmployeesTab = () => {
        return (
            <div
                style={{
                    width: "100%",
                    height: '100%',
                    marginRight: "100px",
                    backgroundColor: '#fff'
                }}
            >
                {/* TITLE */}
                <div
                    style={{
                        width: "100%",
                        justifyContent: "center",
                        display: "flex",
                        paddingTop: '20px'
                    }}
                >
                    <Typography variant="h6" gutterBottom component="div">
                        Active Employees
                    </Typography>
                </div>
                <List
                    sx={{
                        width: "100%",
                        bgcolor: "background.paper",
                        borderRight: "inset",
                        height: "100%",
                        maxHeight: '630px',
                        overflow: "auto",
                    }}
                >
                    <ListItem disablePadding>
                        <Checkbox
                            onChange={(e) => {
                                if (e.target.checked) {
                                    allEmployees?.forEach((emp) =>
                                        arrangementStore.setEmployeeAsActive(emp.id)
                                    );
                                } else {
                                    allEmployees?.forEach((emp) =>
                                        arrangementStore.unsetEmployeeAsActive(emp.id)
                                    );
                                }
                            }}
                        />
                        <ListItemText primary={'Select all'} />
                    </ListItem>
                    {allEmployees?.map((employee: EmployeeDTO) => {
                        const labelId = `active-employee-${employee.id}`;
                        const isActive = arrangementStore?.activeEmployeesIds?.some(
                            (employeeId) => employeeId === employee.id
                        );
                        return (
                            <ListItem key={employee.fullName} disablePadding>
                                <ListItemButton
                                    onClick={() =>
                                        isActive
                                            ? arrangementStore.unsetEmployeeAsActive(employee.id)
                                            : arrangementStore.setEmployeeAsActive(employee.id)
                                    }
                                >
                                    <Checkbox checked={isActive} />
                                    <ListItemText id={labelId} primary={`${employee.fullName}`} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </div>);
    }

    const getRulesTab = () => {
        return <div style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}>
            {/* TITLE */}
            <div
                style={{
                    width: "100%",
                    justifyContent: "center",
                    display: "flex",
                    paddingTop: '20px'
                }}
            >
                <Typography variant="h6" gutterBottom component="div">
                    Rules
                </Typography>
            </div>
            {/* RULE WEIGHTS */}
            <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }} style={{ height: '80%'}}>
                {allRules?.schemas?.map((rule: SchemaDTO) => {
                    const labelId = `rule-${rule?.name}`;
                    return (
                        <ListItem key={rule?.name} disablePadding style={{ width: '450px', paddingTop: '10px' }}>
                            <Checkbox
                                onChange={(enable) =>
                                    enable.target.checked
                                        ? arrangementStore.enableRule(rule?.name)
                                        : arrangementStore.disableRule(rule?.name)
                                }
                                checked={arrangementStore.selectedRules.some(
                                    (selectedRule) =>
                                        selectedRule.ruleName === rule?.name && selectedRule.enable
                                )}
                            />
                            <ListItemText id={labelId} primary={`${rule?.name}`} />
                            <TextField
                                type="number"
                                value={
                                    arrangementStore.selectedRules.find(
                                        (selectedRule) => selectedRule.ruleName === rule?.name
                                    )?.weight || undefined
                                }
                                variant="outlined"
                                onChange={(e) =>
                                    arrangementStore.setRuleWeight(
                                        rule?.name,
                                        parseFloat(e.target.value)
                                    )
                                }
                            />
                        </ListItem>
                    );
                })}
            </List>
            {/* CREATE BUTTON */}
            <div style={{ display: "flex", float: "right", padding: "40px" }}>
                <Button
                    variant="contained"
                    color="secondary"
                    style={{ height: "50px", width: "100px" }}
                    onClick={() => {
                        arrangementService.sendProperties(arrangementStore.properties);
                        navigate(PagesUrl.Arrangement_Status);
                    }}
                >
                    Create
                </Button>
            </div>
        </div>
    }

    const getCurrentTab = () => {
        switch (currentTab) {
            case NewArgmtSubTab.Slots:
                return getSlotsTab();
            case NewArgmtSubTab.Employees:
                return getEmployeesTab();
            case NewArgmtSubTab.Rules:
                return getRulesTab();
            default:
                console.log('unsupported tab')
                return <div />;
        }
    }

    return (<>
        <div style={{ width: '100%', height: '740px', display: 'flex' }}>
            <div style={{ width: '20%', height: '100%', backgroundColor: '#fff' }}>
                <div style={{ width: '100%', color: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', display: 'flex' }}><h3>Settings</h3></div>
                <div><Button style={{ width: '100%', paddingTop: '10px' }} onClick={() => setCurrentTab(NewArgmtSubTab.Slots)}>Slots</Button></div>
                <div><Button style={{ width: '100%', paddingTop: '10px' }} onClick={() => setCurrentTab(NewArgmtSubTab.Employees)}>Employees</Button></div>
                <div><Button style={{ width: '100%', paddingTop: '10px' }} onClick={() => setCurrentTab(NewArgmtSubTab.Rules)}>Rules</Button></div>
            </div>
            <div style={{ width: '80%', height: '100%' }}>
                {getCurrentTab()}
            </div>
        </div>
    </>
    );
});
