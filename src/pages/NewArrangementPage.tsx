import {
    Button,
    Checkbox,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Slider,
    TextField,
    Tooltip,
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
import InfoIcon from '@mui/icons-material/Info';
import { mapRuleToDisplayDetails } from "../interfaces/arrangement.interfaces";
import { Divider } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

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

    useEffect(() => {
        console.log(`arrangementStore.isInitialized: ${JSON.stringify(arrangementStore.isInitialized, undefined, 2)}`);
    }, [arrangementStore.isInitialized])

    if (status !== ComponentStatus.READY || !arrangementStore.isInitialized) {
        // if (true) {
        return <LoadingPaper />;
    }

    const getSlotsTab = () => {
        return <div className="transform-time-table" style={{ height: '100%' }}>
            <div style={{ backgroundColor: "#fff", padding: "20px", height: '100%' }}>
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
                <div style={{ height: 'calc(100% - 59px)', width: '100%', padding: '10px' }}>
                    <DataGrid
                        rows={allEmployees?.map((employee: EmployeeDTO) => {
                            return {
                                id: employee.id,
                                employee: employee.fullName,
                                phoneNnumber: employee.phoneNumber
                            }
                        })}
                        columns={[
                            { field: 'employee', headerName: 'Employee', width: 150 },
                            { field: 'phoneNnumber', headerName: 'PhoneNnumber', width: 150 },
                        ]}
                        pageSize={7}
                        rowsPerPageOptions={[5]}
                        onCellClick={(e) => {
                            const isActive = arrangementStore?.activeEmployeesIds?.some(
                                (employeeId) => employeeId === e.row.id
                            );
                            if (isActive) {
                                arrangementStore.unsetEmployeeAsActive(e.row.id);
                            } else {
                                arrangementStore.setEmployeeAsActive(e.row.id)
                            }
                        }}
                        checkboxSelection       
                        onColumnHeaderClick={(e) => {
                            if (e.field !== '__check__') {
                                return;
                            }
                            if (arrangementStore.activeEmployeesIds.length) {
                                allEmployees.forEach(employee => arrangementStore.unsetEmployeeAsActive(employee.id));
                            } else { // length is 0
                                allEmployees.forEach(employee => arrangementStore.setEmployeeAsActive(employee.id));
                            }
                        }}                 
                    />
                </div>
            </div>);
    }

    const getRulesTab = () => {
        return <div style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}>
            {/* TITLE */}
            <Divider textAlign="left" style={{ padding: '37px 0px 8px 30px', width: '620px' }}>Rules</Divider>
            {/* RULE WEIGHTS */}
            <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }} style={{ height: '70%', padding: '0px 20px' }}>
                {allRules?.schemas?.map((rule: SchemaDTO) => {
                    const labelId = `rule-${rule?.name}`;
                    return (
                        <ListItem key={rule?.name} disablePadding style={{ width: '600px', paddingTop: '10px' }}>
                            <Checkbox
                                onChange={(enable) =>
                                    enable.target.checked
                                        ? arrangementStore.enableRule(rule?.name)
                                        : arrangementStore.disableRule(rule?.name)
                                }
                                checked={arrangementStore.selectedRules.some(
                                    (selectedRule) => selectedRule.ruleName === rule?.name && selectedRule.enable
                                )}
                            />
                            {/* <ListItemText
                                id={labelId}
                                primary={`${rule?.name}`}
                                style={{ width: '300px' }}
                            /> */}
                            <div style={{ width: '500px' }}>
                                {mapRuleToDisplayDetails[rule?.name ?? '']?.label ?? 'unknown'}
                                <Tooltip
                                    title={<Typography fontSize={15}>{mapRuleToDisplayDetails[rule?.name ?? 0]?.description ?? ''}</Typography>}
                                    placement={'bottom-start'}
                                >
                                    <InfoIcon style={{ width: '15px', height: '15px', marginLeft: '10px' }} />
                                </Tooltip>
                            </div>
                            <Slider
                                size="small"
                                value={arrangementStore.selectedRules.find(validRule => validRule.ruleName === rule.name)?.weight ?? 0}
                                step={0.01}
                                aria-label="Small"
                                valueLabelDisplay="auto"
                                min={0}
                                max={1}
                                onChange={(e: any) => {
                                    const curRuleWeight = arrangementStore.selectedRules.find(r => r.ruleName === rule.name)?.weight;
                                    if (curRuleWeight === undefined) {
                                        return;
                                    }
                                    const handleLimit: boolean = arrangementStore.sumOfRulesWeights - curRuleWeight + e.target.value <= 1;
                                    if (handleLimit) {
                                        arrangementStore.setRuleWeight(rule.name, e.target.value);
                                    }
                                }}
                            />
                        </ListItem>
                    );
                })}
            </List>
            {/* CREATE BUTTON */}
            <div style={{ display: "flex", float: "right", padding: "40px" }}>
                <Button
                    variant="contained"
                    style={{ height: "50px", width: "100px" }}
                    disabled={arrangementStore.sumOfRulesWeights != 1}
                    onClick={() => {
                        arrangementService.sendProperties(arrangementStore.properties);
                        navigate(PagesUrl.Arrangement_Status);
                    }}
                >
                    Create
                </Button>
            </div>
        </div >
    }

    const getGettingStarted = () => {
        return <div style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}>
            {/* TITLE */}
            <div
                style={{
                    width: "100%",
                    justifyContent: "center",
                    display: "flex",
                    padding: '20px',
                    height: '80%',
                    alignItems: 'center'
                }}
            >
                <div>
                    <div style={{ alignItems: 'center', width: '100%', textAlign: 'center', color: 'rgba(0, 0, 0, 0.6)' }}><h2>Get started with Evolutionary Shifts Today!</h2></div>
                    <div style={{ alignItems: 'center', width: '100%', textAlign: 'center', color: '#797A7E' }}><h4>First, let's define your company roles and employees</h4></div>
                    {/* CREATE BUTTON */}
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '25px' }}>
                        <Button
                            variant="contained"
                            onClick={() => {
                                navigate(PagesUrl.Employees);
                            }}
                        >
                            Getting Started
                        </Button>
                    </div>
                </div>
            </div >
        </div>;
    }

    const getCurrentTab = () => {
        if (allEmployees.length === 0) {
            return getGettingStarted();
        }

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
                <div style={{ width: '100%', color: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', display: 'flex' }}><h3>Properties</h3></div>
                <div><Button style={{ width: '100%', paddingTop: '10px', borderRadius: '0px', backgroundColor: currentTab === NewArgmtSubTab.Slots ? '#EFF8FF' : '' }} onClick={() => setCurrentTab(NewArgmtSubTab.Slots)}>Slots</Button></div>
                <div><Button style={{ width: '100%', paddingTop: '10px', borderRadius: '0px', backgroundColor: currentTab === NewArgmtSubTab.Employees ? '#EFF8FF' : '' }} onClick={() => setCurrentTab(NewArgmtSubTab.Employees)}>Employees</Button></div>
                <div><Button style={{ width: '100%', paddingTop: '10px', borderRadius: '0px', backgroundColor: currentTab === NewArgmtSubTab.Rules ? '#EFF8FF' : '' }} onClick={() => setCurrentTab(NewArgmtSubTab.Rules)}>Rules</Button></div>
            </div>
            <div style={{
                width: '80%', height: '100%', overflow: 'hidden', boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
                borderRadius: '8px',
                transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
            }}>
                {getCurrentTab()}
            </div>
        </div>
    </>
    );
});
